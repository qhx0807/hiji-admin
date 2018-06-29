import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    login: true,
    pageLoading: false,
    breadcrumbArr: [],
    menuTheme: 'dark',
    themeColor: '',
    messageNum: 0
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
    },
    changeMenuTheme (state, theme) {
      state.menuTheme = theme
    },
    changeMainTheme (state, mainTheme) {
      state.themeColor = mainTheme
    },
    popBreadArr (state) {
      state.breadcrumbArr.pop()
    },
    pushBreadArr (state, obj) {
      state.breadcrumbArr.push(obj)
    }
  },
  actions: {},
  modules: {}
})

export default store
