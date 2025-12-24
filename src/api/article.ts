import request from '@/utils/request'

/**
 * 获取文章列表数据, data是查询参数page,limit,key等
 *
 */
export const getArticleListAPI = (data: any) => {
  return request({
    url: '/articles',
    method: 'GET',
    params: data
  })
}

export const getArticleDetailAPI = (id: number) => {
  return request({
    url: `/articles/${id}`,
    method: 'GET'
  })
}

/**
 * 添加文章数据
 */
export const postArticleAPI = (data: any) => {
  return request({
    url: '/articles',
    method: 'POST',
    data
  })
}

/**
 * 更新文章数据
 */
export const updateArticleAPI = (id: number, data: any) => {
  return request({
    url: `/articles/${id}`,
    method: 'PATCH',
    data
  })
}

/**
 * 删除文章数据
 */
export const deleteArticleAPI = (id: number) => {
  return request({
    url: `/articles/${id}`,
    method: 'DELETE'
  })
}
