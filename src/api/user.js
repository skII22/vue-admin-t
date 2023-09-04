import request from '@/utils/request'

export function login(data) {
  // return request({
  //   url: '/vue-admin-template/user/login',
  //   method: 'post',
  //   data
  // })
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  // return request({
  //   url: '/vue-admin-template/user/info',
  //   method: 'get',
  //   params: { token }
  // })
  return request({
    url: '/api/user/getinfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
    // url: 'https://mock.mengxuegu.com/mock/6436d66756377f1ed96c0c1d/demo/post',
    // method: 'post'
  })
}
