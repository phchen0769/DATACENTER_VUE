import axios from 'axios'
import { useGettersStore } from '@/stores/getters'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { isTimeOut } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VITE_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 使用try/catch确保即使store未初始化也不会报错
    try {
      const gettersStore = useGettersStore()
      const userStore = useUserStore()
      // 在请求头中添加token
      const token = gettersStore.token || userStore.getToken
      if (token) {
        if (isTimeOut()) {
          // 如果超时，跳转到登录页
          userStore.logout()
          return Promise.reject(new Error('token超时,请重新登录'))
        }
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      // store可能尚未初始化，忽略错误
      console.warn('Store not initialized yet:', error)
    }
    
    // 配置接口国际化
    try {
      const gettersStore = useGettersStore()
      config.headers['Accept-Language'] = gettersStore.language
    } catch (error) {
      // store可能尚未初始化，默认使用中文
      config.headers['Accept-Language'] = 'zh'
    }
    
    return config
  },
  (error) => {
    // 提示错误信息
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { success, message, data } = response.data
    // 需要判断当前请求是否成功
    if (success) {
      // 请求成功，且返回数据，解析数据
      // ElMessage.success(message)
      console.log(message)
      return data
      // } else {
      //   // 请求成功，但请求数据失败，返回错误信息
      //   ElMessage.error(message)
      //   return Promise.reject(new Error(message))
    }
  },
  //  响应失败
  (error) => {
    const userStore = useUserStore()
    // token超时
    if (error.response && error.response.data && error.response.data.code === 401) {
      userStore.logout()
      return Promise.reject(error)
    }
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export default service