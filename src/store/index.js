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
    actionTypeArr: [
      {value: 1, label: '商品详情'},
      {value: 2, label: '卡券详情'},
      {value: 3, label: '内部路由'},
      {value: 4, label: '外部链接'},
      {value: 5, label: '模板页'},
      {value: 6, label: '商户首页'},
      {value: 7, label: '领取卡券'},
      {value: 0, label: '不跳转'}
    ],
    couponUseRange: [
      {value: 99, label: '全场通用'},
      {value: 6, label: '全部商品'},
      {value: 4, label: '全部团购'},
      {value: 2, label: '指定商品'},
      {value: 5, label: '指定团购'},
      {value: 1, label: '指定商户'},
      {value: 3, label: '指定商品类型'}
    ]
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
