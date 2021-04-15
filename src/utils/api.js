import axios from 'axios'


// 获取未删除消息
export function  getcode(params){
    console.log(params)
    return axios.get("/order/getNotDeleteOrderMsg",params)					   
}

export const userApi = {
    getcode
}
  export default{
    userApi
  }