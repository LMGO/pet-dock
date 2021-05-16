import axios from 'axios'
import { serverUrl } from '../env'

// 从koa2服务端获取七牛云token
export const getQiniuToken = () => {
  return axios({
    url: 'https://fengblog.xyz:3029/message/getQiniuToken',
    method: 'get'
  })
}

// 发布帖子内容
export const newpost = data => {
  return axios({
    url: serverUrl + '/posts/newpost',
    method: 'post',
    data
  })
}

// 帖子图片
export const postimage = data => {
  return axios({
    url: serverUrl + '/posts/postimage',
    method: 'post',
    data
  })
}

// 帖子视频
export const postvideo = data => {
  return axios({
    url: serverUrl + '/posts/postvideo',
    method: 'post',
    data
  })
}

// 热门帖子
export const gethotpostlist = params => {
  return axios({
    url: serverUrl + '/posts/gethotlist',
    method: 'get',
    params
  })
}
// 热门视频帖子
export const gethotvideolist = params => {
  return axios({
    url: serverUrl + '/posts/gethotvideolist',
    method: 'get',
    params
  })
}
// 关注的帖子
export const getfollowlist = params => {
  return axios({
    url: serverUrl + '/posts/getfollowlist',
    method: 'get',
    params
  })
}
// 关注的视频帖子
export const getfollowvideolist = params => {
  return axios({
    url: serverUrl + '/posts/getfollowvideolist',
    method: 'get',
    params
  })
}
// 最新帖子
export const getnewlist = params => {
  return axios({
    url: serverUrl + '/posts/getnewlist',
    method: 'get',
    params
  })
}
// 最新的视频帖子
export const getnewvideolist = params => {
  return axios({
    url: serverUrl + '/posts/getnewvideolist',
    method: 'get',
    params
  })
}

// 点赞
export const likepost = data => {
  return axios({
    url: serverUrl + '/posts/likepost',
    method: 'post',
    data
  })
}
// 取消点赞
export const dislikepost = data => {
  return axios({
    url: serverUrl + '/posts/dislikepost',
    method: 'delete',
    data
  })
}
// 收藏
export const collectionpost = data => {
  return axios({
    url: serverUrl + '/posts/collectionpost',
    method: 'post',
    data
  })
}
// 取消收藏
export const uncollectionpost = data => {
  return axios({
    url: serverUrl + '/posts/uncollectionpost',
    method: 'delete',
    data
  })
}
// 评论
export const commentpost = data => {
  return axios({
    url: serverUrl + '/posts/comment',
    method: 'post',
    data
  })
}