// 纯前端动态路由获取
import path from 'path'
import type { RouteRecordRaw } from 'vue-router'

// 自定义的路径连接函数
function joinPaths(basePath: string, itemPath: string) {
  return `${basePath.replace(/\/$/, '')}/${itemPath.replace(/^\//, '')}`
}

/**
 * 返回所有子路由
 */
const getChildrenRoutes = (routes: RouteRecordRaw[]) => {
  const result: RouteRecordRaw[] = []
  routes.forEach((route) => {
    if (route.children && route.children.length > 0) {
      result.push(...route.children)
    }
  })
  return result
}
/**
 * 处理脱离层级的路由：某个一级路由为其他子路由，则剔除该一级路由，保留路由层级
 * @param {*} routes router.getRoutes()
 */
export const filterRouters = (routes: RouteRecordRaw[]) => {
  const childrenRoutes = getChildrenRoutes(routes)
  return routes.filter((route) => {
    // 过滤掉缺少component或children属性的路由
    if (!route.component && !route.children) {
      console.warn(`[Router Filter] Route "${route.path}" is missing "component" or "children" property, filtering out.`)
      return false
    }
    
    return !childrenRoutes.find((childrenRoute) => {
      return childrenRoute.path === route.path
    })
  })
}

/**
 * 判断数据是否为空值
 */
function isNull(data: any) {
  if (!data) return true
  if (JSON.stringify(data) === '{}') return true
  if (JSON.stringify(data) === '[]') return true
  return false
}

/**
 * 验证路由是否有效
 */
function isValidRoute(route: RouteRecordRaw): boolean {
  // 检查是否具有有效的组件或子路由
  if (!route.component && !route.children) {
    console.warn(`[Route Validation] Route "${route.path}" is missing both "component" and "children" properties`)
    return false
  }
  return true
}

/**
 * 根据 routes 数据，返回对应 menu 规则数组
 */
export function generateMenus(routes: RouteRecordRaw[], basePath = '') {
  const result: RouteRecordRaw[] = []
  // 遍历路由表
  routes.forEach((item) => {
    // 验证路由有效性
    if (!isValidRoute(item)) return
    
    // 不存在 children && 不存在 meta 直接 return
    if (isNull(item.meta) && isNull(item.children)) return
    // 存在 children 不存在 meta，进入迭代
    if (isNull(item.meta) && !isNull(item.children)) {
      const children = item.children ? generateMenus(item.children) : []
      result.push(...children)
      return
    }
    // 合并 path 作为跳转路径
    // const routePath = path.resolve(basePath, item.path)
    const routePath = joinPaths('', item.path)
    // const routePath = item.path
    // 路由分离之后，存在同名父路由的情况，需要单独处理
    let route = result.find((item) => item.path === routePath)
    if (!route) {
      route = {
        ...item,
        path: routePath,
        children: []
      }

      // icon 与 title 必须全部存在
      if (route.meta?.icon && route.meta?.title && !(route as any).hidden) {
        // meta 存在生成 route 对象，放入 array
        result.push(route)
      }
    }

    // 存在 children 进入迭代到children
    if (item.children) {
      const children = item.children ? generateMenus(item.children, route.path) : []
      if (route.children) {
        route.children.push(...children)
      }
    }
  })
  return result
}