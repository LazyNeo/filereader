import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import {routes} from './common/router'
import store from './common/vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'
import MyPlugin from './common/MyPlugin.js'

// 导入mint-ui
import Mint from 'mint-ui'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
Vue.use(MyPlugin)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Mint)
Vue.use(ElementUI)
require('src/common/globalGet.js')
require('./init.js')
window.Vue = Vue
window.NProgress = NProgress
// 创建一个路由器实例
// 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置
const router = new VueRouter({
  mode: 'history',
  routes,
  // saveScrollPosition: true,
  // scrollBehavior (to, from, savedPosition) {
  //   console.log(savedPosition)
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     return { x: 0, y: 0 }
  //   }
  // }
})
// configRouter(router)

// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
/* eslint-disable no-new */
let host = window.location.host
router.beforeEach((to, from, next) => {
  NProgress.start()
  // window.console.log(to)
  // 检验是否是生产环境
  // if (window.location.host.indexOf('shake.m6fresh.com') == -1) {
  window.CK.setCookie('u_id', 1);
  //   next();
  // }
  // window.console.log('to:' + to.name);
  // window.console.log('from:' + from.name);
  // 检验路径是否需要登陆
  let ifNeedAuth = !to.matched.some(record => record.meta.notRequiresAuth)
  // if (true) {
  if (ifNeedAuth && !(window.CK.getCookie('u_id') > 0)) {
    if (!window.CK.is_weixin()) {
      // 不是微信用户,跳转登陆页面
      next({name: 'adminLogin'})
    } else if (to.name.startsWith('feedShareHome')) {
      // 跳转普通用户登陆
      goTo({type: 72, extra: to.params.vId})
    } else if (to.name.startsWith('feedShareFood')) {
      // 跳转普通用户登陆
      goTo({type: 73, extra: to.params.uId})
    } else if (to.name.startsWith('feed')) {
      // 跳转普通用户登陆
      goTo({type: 70})
    } else if (to.name.startsWith('applicationActivity')) {
      // 跳转参加活动
      goTo({type: 3, extra: to.params.aId})
    } else if (to.name.startsWith('applicationAssess')) {
      // 跳转参加考核
      goTo({type: 4, extra: to.params.eId})
    } else if (to.name.startsWith('application')) {
      // 跳转普通用户登陆
      goTo({type: 1, extra: -1})
    } else if (to.name.startsWith('store')) {
      // 跳转门店管理
      goTo({type: 32, extra: -1})
    } else if (to.name.startsWith('purchase')) {
      // 跳转采购用户登陆
      goTo({type: 10, extra: -1})
    } else if (to.name.startsWith('adminStorage')) {
      // 跳转仓储用户登陆
      goTo({type: 20, extra: -1})
    } else if (to.name.startsWith('adminFeed')) {
      // 跳转养成系统管理员登陆
      goTo({type: 71, extra: -1})
    } else if (to.name.startsWith('admin')) {
      // 跳转问答系统管理员登陆
      goTo({type: 2, extra: -1})
    } else if (to.name.startsWith('scan')) {
      // 跳转问答系统管理员登陆
      goTo({type: 40, extra: -1})
    } else if (to.name.startsWith('doorList')) {
      // 跳转问答系统管理员登陆
      goTo({type: 81, extra: -1})
    } else if (to.name.startsWith('doorSingle')) {
      // 跳转问答系统管理员登陆
      goTo({type: 82, extra: -1})
    } else if (to.name.startsWith('doorOperateList')) {
      // 跳转问答系统管理员登陆
      goTo({type: 83, extra: -1})
    } else if (to.name.startsWith('generalHome')) {
      // 跳转问答系统管理员登陆
      goTo({type: 0, extra: -1})
    } else {
      window.location.href = 'http://www.m6fresh.com'
    }
  } else {
    next()
  }
})
router.afterEach(transition => {
  NProgress.done()
})
window.router = router
function goTo (data) {
  let url = 'http://wx.m6fresh.com/oauthpub_redirect.jsp?r_url=' + encodeURIComponent(encodeURIComponent(`http://${host}/#/admin/autoLogin?otherType=${data.type}^extra=${data.extra}^_v=${window.M6Config.appVersion}`))
  window.location.href = url
}
// 定义全局过滤器
Vue.filter('money', function (value) {
  return Number(value).toFixed(2)
})
// 定义全局过滤器
Vue.filter('weight', function (value) {
  return Number(value).toFixed(3)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
