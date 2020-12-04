import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import { Notification } from 'element-ui'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'login' }
  },
  {
    path: '/about',
    name: 'About',
    meta: { auth: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/data/demo',
    name: 'demo',
    meta: { auth: true },
    component: () => import('../views/data/demo.vue')
  },

  { path: '/users/login', alias: '/login', name: 'login', component: () => import('../views/user/login.vue') },
  { path: '/users/register', alias: '/register', name: 'register', component: () => import('../views/user/register.vue') },
  { path: '*', redirect: { name: 'login' } }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((router) => router.meta.auth)) {
    if (store.state.isUserLogin) {
      next()
    } else {
      Notification({
        title: '提示',
        type: 'warning',
        message: '请登录后再访问该页面'
      })
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    }
  }
  next()
})
export default router
