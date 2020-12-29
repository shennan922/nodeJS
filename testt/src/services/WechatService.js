import req from './index'
import store from '../store'

export default {
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
      }
      alert(JSON.parse(body));
    });        
    //alert(ticket.data.ticket.pp)
    //console.log("ticket.data.ticket:" + JSON.stringify(ticket))
      if (ticket) {      
        return  'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ticket.data.ticket
      }else{
        return ''
      }
     
     
},
}


