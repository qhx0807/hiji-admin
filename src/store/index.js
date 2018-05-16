import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    login: true,
    pageLoading: false
  },
  getters: {
    isLoading (state) {
      return state.pageLoading
    }
  },
  mutations: {
    pageLoading (state, n) {
      state.pageLoading = !!n
    }
  },
  actions: {},
  modules: {}
})

export default store
