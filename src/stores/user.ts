import { defineStore } from 'pinia'
import { login, getUserInfoAPI } from '@/api/sys'
import { setStorage, getStorage, clearStorage } from '@/utils/storage'
import { TOKEN } from '@/constant'
import router, { resetRouter } from '@/router'
import { setTimeStamp } from '@/utils/auth'
import type { AxiosResponse } from 'axios'

interface UserInfo {
  [key: string]: any
}

export const useUserStore = defineStore('user', {
  // 应用状态
  state: () => ({
    token: getStorage(TOKEN) || '',
    // 初始化userInfo
    userInfo: {} as UserInfo
  }),

  // 获取状态
  getters: {
    getToken(): string {
      return this.token
    },

    getUserInfo(): UserInfo {
      return this.userInfo
    },

    hasUserInfo(): boolean {
      return JSON.stringify(this.userInfo) !== '{}'
    }
  },

  // 修改状态的方法
  actions: {
    // 设置Token到state中
    setToken(token: string) {
      this.token = token
      // 存token到localStorage
      setStorage(TOKEN, token)
    },

    // 设置UserInfo到state中
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },

    /**
     * 登录请求动作
     */
    login(userInfo: { username: string; password: string }): Promise<void> {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({
          username,
          // md5加密
          // password: md5(password)
          password: password
        })
          .then((responseData: any) => {
            // 请求拦截器会处理响应并返回data字段
            // 但登录接口可能返回完整的token对象，需要提取token值
            console.log('Login response:', responseData)
            
            // 提取token，支持多种可能的字段名
            const token = responseData?.access || 
                          responseData?.token || 
                          responseData?.accessToken ||
                          responseData?.data?.access ||
                          responseData?.data?.token ||
                          responseData?.data?.accessToken ||
                          responseData
            
            // 设置token
            if (token && typeof token === 'string') {
              this.setToken(token)
              
              // 跳转到首页
              router.push('/').then(() => {
                resolve()
              }).catch((err) => {
                console.warn('Navigation error:', err)
                resolve() // 即使导航失败也认为登录成功
              })
              
              // 保存登录时间
              setTimeStamp()
            } else {
              reject(new Error('Invalid token in response'))
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    /**
     * 获取用户信息
     */
    async fetchUserInfo(): Promise<any> {
      try {
        const res = await getUserInfoAPI()
        this.setUserInfo(res)
        
        // 打印后端返回的路由信息到控制台
        if (res && res.routers) {
          console.log('Backend routers:', JSON.stringify(res.routers, null, 2))
        } else {
          console.log('No routers found in user info response')
        }
        
        return res
      } catch (error) {
        // 如果获取用户信息失败，清除token并抛出错误
        this.logout()
        throw error
      }
    },

    /**
     * 退出登录
     */
    logout() {
      // 清空用户路由
      resetRouter()
      // 清空token
      this.setToken('')
      // 清空用户信息
      this.setUserInfo({})
      // 清空localStorage的token
      clearStorage()
      // TODO: 清理权限相关配置
      // 跳转到登录页
      router.push('/login')
    }
  }
})
