import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { Loading } from 'element-ui'
import store from '../store'

const req ={}
const request = axios.create({
  baseURL: '/api',
  headers: {
    showLoading: true,
    Authorization: `Bearer ${store.state.token}`
  }
})

const wapirequest = axios.create({
  baseURL: '/wechat',
  headers: {
   
  }
})

/*const wqrrequest = axios.create({
  baseURL: 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=',
  headers: {
   
  }
})*/
/*const requestMock = axios.create({
  baseURL: '/mock',
  headers: {
    showLoading: true,
  }
})*/

NProgress.configure({ showSpinner: false })

request.interceptors.request.use(config => {
  // let loadingInstance = Loading.service()
  // store.dispatch('setLoadingInstance', loadingInstance)
  if (config.headers.showLoading) {
    NProgress.start()
    delete config.headers.showLoading
  }
  config.headers.Authorization = `Bearer ${store.state.token}`
  return config
})
request.interceptors.response.use(response => {
  NProgress.done()
  // let loadingInstance = store.state.loadingInstance
  // loadingInstance.close()
  return response
}, function (error) {
  NProgress.done()
  // let loadingInstance = store.state.loadingInstance
  // loadingInstance.close()
  return Promise.reject(error)
})
req.request = request
req.wapirequest = wapirequest
export default req
