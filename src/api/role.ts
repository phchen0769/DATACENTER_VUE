import request from '@/utils/request'

/**
 * 获取角色列表数据
 */
export const getRoleListAPI = () => {
  return request({
    url: '/roles',
    method: 'GET'
  })
}

/**
 * 获取角色权限列表数据
 */
export const getRolePermissionAPI = (id: number) => {
  return request({
    url: `/roles/${id}`,
    method: 'GET'
  })
}

/**
 *
 */
export const distributePermission = () => {}

/**
 * 添加角色数据
 */
export const updateRoleAPI = (id: number, data: any) => {
  return request({
    url: `/roles/${id}`,
    method: 'PATCH',
    data
  })
}
