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

  async checkPermission (code) {
    return await req.request.get(
      '/wechat/checkpermission?code='+code
    )
  },

  async getQRCode (id) {
    var data = {"expire_seconds": 604800, "action_name": "QR_STR_SCENE", "action_info": {"scene": {"scene_str": id}}}
    //alert("kaishi")
    var ticket =await req.wapirequest.post(`/qrcode/create?access_token=${store.state.user.wechat}`,data,function (error, response, body) {
      if(error!==null){
        alert(error)
       // reject("获取access_token失败 检查getAccessToken函数");
      }
      alert(JSON.parse(body));
    });        
    //alert("jieshu")
    //console.log("ticket.data.ticket:" + JSON.stringify(ticket))
      if (ticket) {      
        return  'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ticket.data.ticket
      }else{
        return ''
      }
     
     
},
  async login (data) {

    const response = await req.request.post(
      '/user/login',
      data
    )
    return response
  }
}