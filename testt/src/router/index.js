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
    component: () => import( '../views/About.vue')
  },
  {
    path: '/data/demo',
    name: 'demo',
    meta: { auth: true },
    component: () => import('../views/data/demo.vue')
  },
  {
    path: '/data/Navigation',
    name: 'Navigation',
    meta: { auth: true },
    component: () => import('../views/data/Navigation.vue'),
    children:[
      {
        path: '/data/MySE',
        name: 'MySE',
        component: () => import('../views/data/MySE.vue')
      },
      {
        path: '/data/Test',
        name: 'Test',
        component: () => import('../views/data/Test.vue')
      },
    ]
  },

  { path: '/users/login', alias: '/login', name: 'login', component: () => import('../views/user/login.vue') },
  { path: '/users/register', alias: '/register', name: 'register', component: () => import('../views/user/register.vue') },
 // { path: '*', redirect: { name: 'login' } }
  {
    path: "/404",
    name: "notFound",
    component: () => import('../views/error/NotFound.vue')
  },
  {
    path: "/404",
    name: "500Error",
    component: () => import('../views/error/500Error.vue')
  },
  {
    path: "*",
    redirect: "/404"
  }
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
