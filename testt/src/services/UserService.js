import req from './index'
import store from '../store'

export default {
  async getUserById () {

    const response = await req.request.get('/user/:id')
    return response.data
  },
  async register (data) {
    return await req.request.post(
      '/user/',
      data
    )
  },
  getQRCode () {
    return  req.wechatrequest.get(
      '/getqrcode?wechat='+store.state.user.wechat,      
    )
  },
  async login (data) {

    const response = await req.request.post(
      '/user/login',
      data
    )
    return response
  }
}
