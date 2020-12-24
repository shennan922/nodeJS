import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './registerServiceWorker'
import './mock'
import '../public/static/UE/ueditor.config.js'
import '../public/static/UE/ueditor.all.min.js'
import '../public/static/UE/lang/zh-cn/zh-cn.js'
import '../public/static/UE/ueditor.parse.js'
//可引入，也可不引入
import '../public/static/UE/themes/default/css/ueditor.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
