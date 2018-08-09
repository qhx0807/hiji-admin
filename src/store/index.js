/* eslint-disable */
import 'babel-polyfill'
// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    login: true,
    pageLoading: false,
    breadcrumbArr: [],
    menuTheme: 'dark',
    themeColor: '',
    messageNum: 0,
    dateOptions: {
      shortcuts: [
        {
          text: '最近一周',
          value () {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
          }
        },
        {
          text: '最近一月',
          value () {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
          }
        },
        {
          text: '最近三月',
          value () {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
          }
        }
      ]
    },
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
