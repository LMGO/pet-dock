import axios from 'axios'
import { serverUrl } from '../env'

// 用户注册
export const signup = data => {
  return axios({
    url: serverUrl + '/users/signup',
    method: 'post',
    data
  })
}

// 用户登录
export const signin = data => {
  return axios({
    url: serverUrl + '/users/signin',
    method: 'post',
    data
  })
}

//关注用户
export const folowuser = data => {
  return axios({
    url: serverUrl + '/users/followuser',
    method: 'post',
    data
  })
}

//取消关注
export const unfolowuser = data => {
  return axios({
    url: serverUrl + '/users/unfollowuser',
    method: 'delete',
    data
  })
}

//获取粉丝和关注数量
export const getffcount = params => {
  return axios({
    url: serverUrl + '/users/getffcount',
    method: 'get',
    params
  })
}