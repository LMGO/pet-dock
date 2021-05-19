import axios from 'axios'
import { serverUrl } from '../env'

// 发布文章内容
export const newart = data => {
  return axios({
    url: serverUrl + '/arts/newart',
    method: 'post',
    data
  })
}

// 热门文章
export const gethotartlist = params => {
  return axios({
    url: serverUrl + '/arts/gethotartlist',
    method: 'get',
    params
  })
}
// 关注的文章
export const getfollowartlist = params => {
  return axios({
    url: serverUrl + '/arts/getfollowartlist',
    method: 'get',
    params
  })
}
// 最新文章
export const getnewartlist = params => {
  return axios({
    url: serverUrl + '/arts/getnewartlist',
    method: 'get',
    params
  })
}

// 点赞
export const likeart = data => {
  return axios({
    url: serverUrl + '/arts/likeart',
    method: 'post',
    data
  })
}
// 取消点赞
export const dislikeart = data => {
  return axios({
    url: serverUrl + '/arts/dislikeart',
    method: 'delete',
    data
  })
}
// 收藏
export const collectionart = data => {
  return axios({
    url: serverUrl + '/arts/collectionart',
    method: 'post',
    data
  })
}
// 取消收藏
export const uncollectionart = data => {
  return axios({
    url: serverUrl + '/arts/uncollectionart',
    method: 'delete',
    data
  })
}
// 评论
export const commentart = data => {
  return axios({
    url: serverUrl + '/arts/comment',
    method: 'post',
    data
  })
}

// 查看详情
export const artdetail = params => {
  return axios({
    url: serverUrl + '/arts/getdetail',
    method: 'get',
    params
  })
}