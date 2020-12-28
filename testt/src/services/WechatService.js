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
    //alert(ticket.data.ticket.pp)
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


exports.textMsg = function (toUser, fromUser, content) {
    var resultXml = "<xml><ToUserName><![CDATA[" + fromUser + "]]></ToUserName>";
    resultXml += "<FromUserName><![CDATA[" + toUser + "]]></FromUserName>";
    resultXml += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
    resultXml += "<MsgType><![CDATA[text]]></MsgType>";
    resultXml += "<Content><![CDATA[" + content + "]]></Content></xml>";
    return resultXml;
}
exports.welcomeMsg = function (toUser, fromUser, content) {
    var resultXml = "<xml><ToUserName><![CDATA[" + fromUser + "]]></ToUserName>";
    resultXml += "<FromUserName><![CDATA[" + toUser + "]]></FromUserName>";
    resultXml += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
    resultXml += "<MsgType><![CDATA[text]]></MsgType>";
    resultXml += "<Content><![CDATA[" + content + "]]></Content></xml>";
    return resultXml;
}

exports.newsMsg = function (toUser, fromUser, content) {
    var resultXml = "<xml><ToUserName><![CDATA[" + fromUser + "]]></ToUserName>";
    resultXml += "<FromUserName><![CDATA[" + toUser + "]]></FromUserName>";
    resultXml += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
    resultXml += "<MsgType><![CDATA[news]]></MsgType>";
    resultXml += "<ArticleCount>1</ArticleCount>";
    resultXml += "<Articles><item><Title><![CDATA[seantest]]></Title>";
    resultXml += "<Description><![CDATA[seandescription1]]></Description>";
    resultXml += "<PicUrl><![CDATA[https://bkimg.cdn.bcebos.com/pic/4ec2d5628535e5ddebfaea2b74c6a7efcf1b626b?x-bce-process=image/resize,m_lfit,w_268,limit_1]]></PicUrl>";
    resultXml += "<Url><![CDATA[http://ec2-3-12-241-148.us-east-2.compute.amazonaws.com:8080/data/Welcome]]></Url>";
    resultXml += "</item></Articles></xml>";
    return resultXml;
}
exports.message = function (data) {
    console.log(data)
    var content;
    if (data === "np") {
        content = "welcome np test account!"
    } 
    else if(data === ""){ 
        content = "hello cute"
    }else {
        content = ".......";
    }
    return content;
}
exports.imgMsg = function(toUser, fromUser, media_id) {
    var xmlContent = "<xml><ToUserName><![CDATA["+ toUser +"]]></ToUserName>";
        xmlContent += "<FromUserName><![CDATA["+ fromUser +"]]></FromUserName>";
        xmlContent += "<CreateTime>"+ new Date().getTime() +"</CreateTime>";
        xmlContent += "<MsgType><![CDATA[image]]></MsgType>";
        xmlContent += "<Image><MediaId><![CDATA["+ media_id +"]]></MediaId></Image></xml>";
    return xmlContent; 
}