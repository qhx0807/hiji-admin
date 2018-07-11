/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import _ from 'lodash'
// import viserVue from 'viser-vue'

import 'iview/dist/styles/iview.css'

Vue.use(iView)
Vue.prototype._ = _
// Vue.use(viserVue)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})

router.afterEach(route => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

Vue.directive('imgview', {
  bind (el, binding, vnode) {
    let imgSrc = el.getAttribute('src')
    el.style.cursor = 'zoom-in'
    el.addEventListener('click', function (e) {
      if (imgSrc) {
        document.getElementById('imgViewDom').firstChild.src = imgSrc
        document.getElementById('imgViewDom').style.display = 'flex'
      }
    })
  },
  unbind (el) {
    el.removeEventListener('click', null)
  }
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
