/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import _ from 'lodash'
import viserVue from 'viser-vue'

import 'iview/dist/styles/iview.css'

Vue.use(iView)
Vue.prototype._ = _
Vue.use(viserVue)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})

router.afterEach(route => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
