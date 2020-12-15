import req from './index'
import store from '../store'

export default {
  async getUserById () {
    const response = await req.request.get('/users/3')
    return response.data
  },
  async register (data) {
    return await req.request.post(
      '/users',
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
      '/user/UserOperation/login',
      data
    )
    return response
  }
}
