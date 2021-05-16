import axios from 'axios'
import { serverUrl } from '../env'

// 发布话题
export const newtopic = data => {
  return axios({
    url: serverUrl + '/topics/newtopic',
    method: 'post',
    data
  })
}

// 话题图片
export const topicimage = data => {
  return axios({
    url: serverUrl + '/topics/topicimage',
    method: 'post',
    data
  })
}

//通过名称搜索匹配
export const getbyname = params => {
  return axios({
    url: serverUrl + '/topics/getbyname',
    method: 'get',
    params
  })
}

//浏览话题
export const  browsetopic= data => {
  return axios({
    url: serverUrl + '/topics/browsetopic',
    method: 'put',
    data
  })
}

//获取热门话题列表
export const gethotlist=()=>{
  return axios({
    url: serverUrl + '/topics/gethotlist',
    method: 'get',
  })
}