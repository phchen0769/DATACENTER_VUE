import request from '@/utils/request'

/**
 * 获取股票列表数据, data是查询参数page,limit,key等
 *
 */
export const getdividendListAPI = (data: any) => {
  return request({
    url: '/dividends',
    method: 'GET',
    params: data
  })
}

export const getdividendDetailAPI = (id: number) => {
  return request({
    url: `/dividends/${id}`,
    method: 'GET'
  })
}

/**
 * 添加股票数据
 */
export const postdividendAPI = (data: any) => {
  return request({
    url: '/dividends',
    method: 'POST',
    data
  })
}

/**
 * 更新股票数据
 */
export const updatedividendAPI = (id: number, data: any) => {
  return request({
    url: `/dividends/${id}`,
    method: 'PATCH',
    data
  })
}

/**
 * 删除股票数据
 */
export const deletedividendAPI = (id: number) => {
  return request({
    url: `/dividends/${id}`,
    method: 'DELETE'
  })
}
