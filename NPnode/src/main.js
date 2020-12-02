// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import './styles/index'
import './plugins/element.js'
import './components'
import axios from 'axios'

Vue.prototype.$axios=axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
