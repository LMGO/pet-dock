import axios from 'axios'
import { serverUrl } from '../env'

// 发布问题
export const newquestion = data => {
  return axios({
    url: serverUrl + '/questions/newquestion',
    method: 'post',
    data
  })
}

// 问题图片
export const questionimage = data => {
  return axios({
    url: serverUrl + '/questions/questionimage',
    method: 'post',
    data
  })
}

// 关注问题
export const followquestion = data => {
  return axios({
    url: serverUrl + '/questions/followquestion',
    method: 'post',
    data
  })
}

// 取消关注问题
export const unfollowquestion = data => {
  return axios({
    url: serverUrl + '/questions/unfollowquestion',
    method: 'delete',
    data
  })
}

// 热门问题
export const gethotquestionlist = params => {
  return axios({
    url: serverUrl + '/questions/gethotlist',
    method: 'get',
    params
  })
}
// 最新
export const getnewqustionlist = params => {
  return axios({
    url: serverUrl + '/questions/getnewlist',
    method: 'get',
    params
  })
}
// 我关注的
export const getfollowquestionlist = params => {
  return axios({
    url: serverUrl + '/questions/getfollowlist',
    method: 'get',
    params
  })
}
// 浏览问题
export const browsequestion = data => {
  return axios({
    url: serverUrl + '/questions/browsequestion',
    method: 'put',
    data
  })
}
// 获取问题详情及所有回答
export const getdetails = params => {
  return axios({
    url: serverUrl + '/questions/getdetails',
    method: 'get',
    params
  })
}
// 赞同
export const agreeanswer = data => {
  return axios({
    url: serverUrl + '/answers/agreeanswer',
    method: 'post',
    data
  })
}
// 取消赞同
export const disagreeanswer = data => {
  return axios({
    url: serverUrl + '/questions/disagreeanswer',
    method: 'delete',
    data
  })
}

// 排序
export const sortanswer = params => {
  return axios({
    url: serverUrl + '/answers/sortanswer',
    method: 'get',
    params
  })
}