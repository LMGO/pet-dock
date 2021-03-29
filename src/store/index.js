import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    closeLoginPopup: true //控制关闭登录弹窗
  },
  mutations: {
    changestatus (state, status) {
      // 变更登录弹窗状态
      state.closeLoginPopup = status
    }
  },
  actions: {
  },
  modules: {
  }
})
