import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    closeLoginPopup: true ,//控制关闭登录弹窗
    PostPopup:{
      isclose:true,//控制动态发布弹窗开闭
      post:'post'//控制发布话题或帖子，默认帖子
    },
    userInfo:{}
  },
  mutations: {
    changestatus (state, status) {
      // 变更登录弹窗状态
      state.closeLoginPopup = status
    },
    changepostpopup(state, status){
      // 变更发布弹窗状态
      state.PostPopup = status
    },
    userInfo(state, data) {
      state.userInfo = data
    },
  },
  actions: {
    getUserInfo({
      commit
    }, data) {
      commit('userInfo', data)
    },
  },
  modules: {
  }
})
