import router from '@/router'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { arrayToRouter } from '@/utils/router'

// 白名单
const whiteList = ['/login']

/**
 * 路由前置守卫
 * @param {*} to 要到的路由
 * @param {*} from 从哪个路由来
 * @param {*} next 是否要去
 */
router.beforeEach(async (to, from, next) => {
  // 获取用户store实例
  const userStore = useUserStore()

  // 从store中获取token
  if (userStore.getToken) {
    // 1、用户已登录，则不允许进入login
    if (to.path === '/login') {
      next('/')
      return
    } else {
      // 判断用户信息是否存在，如不存在，则获取用户信息
      if (!userStore.hasUserInfo) {
        try {
          await userStore.fetchUserInfo()

          // 设置计算属性，获取用户路由
          const privateRoutes = computed(() => {
            return arrayToRouter(userStore.getUserInfo.routers)
          })

          // 后端控制路由：私有动态路由，赋值给vue-router
          privateRoutes.value.forEach((item) => {
            router.addRoute(item)
          })

          // 重新导航到目标路由
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败，重定向到登录页
          next('/login')
        }
      } else {
        // 用户信息已存在，直接放行
        next()
      }
    }
  } else {
    // 2、用户未登录，则只允许进入login
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})
