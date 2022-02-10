import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/api/FanYuan/List?pageSize=' + data.pageSize + '&FullName=' + data.FullName + '',
    method: 'get'
  })
}
export function save(data) {
  return request({
    url: '/api/FanYuan/Create',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: '/api/FanYuan/Delete?id=' + data,
    method: 'post'
  })
}
