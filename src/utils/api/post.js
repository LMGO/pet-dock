// import axios from 'axios'
// // import {
// //   serverUrl
// // } from '../utils/env.js'
// // import store from '@/store/store'

// // 发表帖子
// export const addPostAndImages = data => {
//   return axios({
//       url: serverUrl + '/community/community/publishPostImages',
//       method: 'post',
//       data
//     })
//     .then(res => {
//       console.log(res)
//       return res.data
//     })
//     .catch(err => {
//       if (err) {
//         console.log(err)
//       }
//     })
// }

// // 分开发表帖子
// export const addPost = data => {
//   return axios({
//     url: serverUrl + '/post/post/insertSelective',
//     method: 'post',
//     data
//   })
// }

// // 添加图片
// export const addPostImage = data => {
//   return axios({
//     url: serverUrl + '/pimage/pimage/insertSelective',
//     method: 'post',
//     data
//   })
// }

// // 添加视频
// export const addPostVideo = data => {
//   return axios({
//     url: serverUrl + '/pvideo/pvideo/insertSelective',
//     method: 'post',
//     data
//   })
// }

// // 获取所有帖子
// export const getAllPosts = () => {
//   return axios({
//       url: serverUrl + '/community/community/getAllPostsLogin',
//       method: 'get',
//       params: {
//         user_ID: store.state.userInfo.id || "-1"
//       }
//     })
//     .then(res => {
//       console.log(res)
//       return res.data.detailMsg.data
//     })
//     .catch(err => {
//       if (err) {
//         console.log(err)
//       }
//     })
// }

// // 获取自己关注的人最近发表的帖子
// export const getFollowsPost = params => {
//   return axios({
//       url: serverUrl + '/community/community/getFollowsPost',
//       method: 'get',
//       params
//     })
//     .then(res => {
//       return res.data
//     })
//     .catch(err => {
//       if (err) {
//         console.log(err)
//       }
//     })
// }

// // 根据类型获取该类型所有帖子
// export const getAllPostsByType = params => {
//   return axios({
//     url: serverUrl + '/community/community/getAllPostsByTypeLogin',
//     method: 'get',
//     params
//   })
// }

// // 根据风格获取该风格所有帖子
// export const getAllPostsByStyle = params => {
//   return axios({
//     url: serverUrl + '/community/community/getAllPostsByStyleLogin',
//     method: 'get',
//     params
//   })
// }

// // 根据id查询一条帖子
// export const getPostById = params => {
//   return axios({
//     url: serverUrl + '/community/community/getPostByIdLogin',
//     method: 'get',
//     params
//   })
// }

// // 根据id删除一条帖子
// export const deletePostById = params => {
//   return axios({
//     url: serverUrl + '/community/community/deletePostById',
//     method: 'delete',
//     params
//   })
// }

// // 点赞
// export const likePost = data => {
//   return axios({
//     url: serverUrl + '/plikes/plikes/insertSelective',
//     method: 'post',
//     data
//   })
// }

// // 取消点赞
// export const unLikePost = params => {
//   return axios({
//     url: serverUrl + '/plikes/plikes/deleteByUserIdAndPostId',
//     method: 'delete',
//     params
//   })
// }

// // 收藏
// export const collectPost = data => {
//   return axios({
//     url: serverUrl + '/pfavorites/pfavorites/insertSelective',
//     method: 'post',
//     data
//   })
// }

// // 取消收藏
// export const unCollectPost = params => {
//   return axios({
//     url: serverUrl + '/pfavorites/pfavorites/deleteByUserIdAndPostId',
//     method: 'delete',
//     params
//   })
// }

// // 评论
// export const commentPost = data => {
//   return axios({
//     url: serverUrl + '/pcomments/pcomments/insertSelective',
//     method: 'post',
//     data
//   })
// }

// // 删除评论
// export const deleteComment = params => {
//   return axios({
//     url: serverUrl + '/pcomments/pcomments/deleteById',
//     method: 'delete',
//     params
//   })
// }

// // 获取新消息
// export const getNewMessages = params => {
//   return axios({
//     url: serverUrl + '/community/community/getCommunityMessage',
//     method: 'get',
//     params
//   })
// }

// // 从koa2服务端获取七牛云token
// export const getQiniuToken = () => {
//   return axios({
//     url: 'https://fengblog.xyz:3029/message/getQiniuToken',
//     method: 'get'
//   })
// }