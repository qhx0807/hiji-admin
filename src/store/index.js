import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    login: true,
    pageLoading: false,
    breadcrumbArr: []
  },
  getters: {
    isLoading (state) {
      return state.pageLoading
    },
    breadcrumList (state) {
      return state.breadcrumbArr
    }
  },
  mutations: {
    pageLoading (state, n) {
      state.pageLoading = !!n
    },
    updateBread (state, arr) {
      let base = [{name: 'Home', to: '/Main'}]
      state.breadcrumbArr = base.concat(arr)
    }
  },
  actions: {},
  modules: {}
})

export default store
