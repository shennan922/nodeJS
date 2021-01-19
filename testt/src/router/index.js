import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
//import config from '../config'
import wechatService from '../services/WechatService'
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
    meta: { auth: true, title: 'about' },
    component: () => import('../views/About.vue')
  },
  {
    path: '/data/demo',
    name: 'demo',
    meta: { auth: true, title: 'about' },
    component: () => import('../views/data/demo.vue')
  },
  {
    path: '/data/ActiveUser',
    name: 'ActiveUser',
    meta: { auth: false, wechat:true, title: 'Welcome' },
    // meta: { auth: true, title: 'ActiveUser' },
    component: () => import('../views/data/ActiveUser.vue')
  },
  {
    path: '/data/ContentLink',
    name: 'ContentLink',
    meta: { auth: false, title: 'ContentLink' },
    component: () => import('../views/data/ContentLink.vue')
  },
  {
    path: '/data/InactiveUser',
    name: 'InactiveUser',
    // meta: { auth: true, title: 'InactiveUser' },
    component: () => import('../views/data/InactiveUser.vue')
  },
  {
    path: '/data/Welcome',
    name: 'Welcome',
    // meta: { auth: true, title: 'Welcome' },
    component: () => import('../views/data/Welcome.vue')
  },
  {
    path: '/data/Navigation',
    name: 'Navigation',
    meta: { auth: true, title: 'Home' },
    component: () => import('../views/data/Navigation.vue'),
    children: [
      {
        path: '/data/MySE',
        name: 'MySE',
        meta: { auth: true, title: 'MySE' },
        component: () => import('../views/data/MySE.vue')
      },
      {
        path: '/data/Test',
        name: 'Test',
        meta: { auth: true, title: 'Overview' },
        component: () => import('../views/data/Test.vue')
      },
      {
        path: '/data/Log',
        name: 'Log',
        meta: { auth: true, title: 'Log' },
        component: () => import('../views/data/Log.vue')
      },

      {
        path: '/data/Analytics',
        name: 'Analytics',
        meta: { auth: true, title: 'Analytics' },
        component: () => import('../views/data/Analytics.vue')
      },
      {
        path: '/data/MyContent',
        name: 'MyContent',
        meta: { auth: true, title: 'My Content' },
        component: () => import('../views/data/MyContent.vue')
      },
      {
        path: '/data/MyPush',
        name: 'MyPush',
        meta: { auth: true, title: 'My Push' },
        component: () => import('../views/data/MyPush.vue')
      },
      {
        path: '/data/RequestList',
        name: 'RequestList',
        meta: { auth: true, title: 'Request List' },
        component: () => import('../views/data/RequestList.vue')
      },
      {
        path: '/data/OnlineMeeting',
        name: 'OnlineMeeting',
        meta: { auth: true, title: 'OnlineMeeting' },
        component: () => import('../views/data/OnlineMeeting.vue')
      },
      
    ]
  },

  {
    path: '/users/login',
    alias: '/login',
    name: 'login',
    component: () => import('../views/user/login.vue')
  },
  {
    path: '/users/register',
    alias: '/register',
    name: 'register',
    component: () => import('../views/user/register.vue')
  },
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


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


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
  }else if (to.matched.some((router) => router.meta.wechat)) {    
    wechatService.checkPermission(to.query.code).then(tt=>
      {       
        if(tt.data.code==200){
          store.state.wechatUser = tt.data.id
          next()
        }else{
          next({
            name: 'InactiveUser',
            query: { redirect: to.fullPath }
          })
        }
       
      })
  
  }
  else{
  next()
  }
})
export default router
