/* eslint-disable */
// import 'babel-polyfill'
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
      {value: 8, label: '拼团商品(单个)'},
      {value: 9, label: '微页面'},
      {value: 10, label: '扫一扫'},
      {value: 0, label: '不跳转'}
    ],
    cityList: [],
    couponUseRange: [
      {value: 6, label: '全部商品'},
      {value: 4, label: '全部团购'},
      {value: 2, label: '指定商品'},
      {value: 5, label: '指定团购'},
      {value: 1, label: '指定商户(商品)'},
      {value: 3, label: '指定商品类型'},
      {value: 7, label: '以下商品不可用'},
      {value: 8, label: '以下团购不可用'}
    ],
    orderTypeConst: [
      {value: 0, label: '全部'},
      {value: 1, label: '扫码支付'},
      {value: 2, label: '停车缴费'},
      {value: 3, label: '团购订单'},
      {value: 4, label: '邮购订单'},
      {value: 5, label: '砍价订单'},
      {value: 6, label: '拼团订单'},
      {value: 7, label: '积分兑换商品订单'},
      {value: 8, label: '积分兑换卡券订单'},
      {value: 9, label: '邀请有礼领取商品'},
      {value: 10, label: '邀请有礼卡券'},
      {value: 11, label: '虚拟订单'},
      {value: 12, label: '抢购商品订单'},
      {value: 13, label: '抢购卡券订单'},
      {value: 14, label: '超市订单'},
    ],
    inviteTypeArr: [
      {value: 1, label: '线下实物商品'},
      {value: 2, label: '线上实物商品'},
      {value: 3, label: '优惠券'},
      {value: 4, label: '团购券'},
      {value: 5, label: '抽奖'},
      {value: 6, label: '积分'},
    ],
    designGoodsGroup: []
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
    },
    updateOrderTypeArr (state, arr) {
      state.orderTypeConst = arr
    },
    updateCityList (state, arr) {
      state.cityList = arr
    },
    updateDesignGoodsGroup (state, arr) {
      state.designGoodsGroup = arr
    }
  },
  actions: {},
  modules: {}
})

export default store
