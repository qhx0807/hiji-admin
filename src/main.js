// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import ZkTable from 'vue-table-with-tree-grid'
import _ from 'lodash'

import './theme/index.less'

Vue.use(iView)
Vue.component(ZkTable.name, ZkTable)
Vue.prototype._ = _

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})

router.afterEach(route => {
  // setTimeout(() => {
  //   iView.LoadingBar.finish()
  // }, 1500)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
