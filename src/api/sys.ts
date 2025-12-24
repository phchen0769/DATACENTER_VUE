import request from '@/utils/request'
/**
 * 登录（封装登录模块）
 * return promise
 */

export const login = (data: any) => {
  return request({
    url: '/login',
    method: 'POST',
    data
  })
}

/**
 * 获取当前用户信息
 * return promise
 */
export const getUserInfoAPI = () => {
  return request({
    // userinfo，无实际意义，用户发起retrieve请求，后端根据token返回当前用户信息
    url: '/userinfo/userinfo',
    method: 'GET'
  })
}
