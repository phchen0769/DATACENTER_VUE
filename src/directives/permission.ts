import { useGettersStore } from '@/stores/getters'

function checkPermission(el, binding) {
  // 获取按钮权限
  const { value } = binding
  // 获取用户所有功能权限
  const gettersStore = useGettersStore()
  const points = gettersStore.userInfo

  console.log(points)
  // value必须是一个数组
  if (value && value instanceof Array) {
    // 判断用户是否有按钮权限
    const hasPermission = points.some((point) => {
      return value.includes(point)
    })
    // 匹配失败则删除按钮
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(
      "需要指定按钮权限，如v-permission=\"['admin','editor'.....]\""
    )
  }
}

export default {
  // 在绑定元素的父组件被挂载之后调用
  mounted(el, binding) {
    checkPermission(el, binding)
  },

  // 在包含组件的vnode及其子vnode被更新时调用
  update(el, binding) {
    checkPermission(el, binding)
  }
}