const axios = require('axios')
const db = require('../models/Index')
const logger = require('../logger/log4')
const xml2js = require('xml2js');
const msg = require('../utils/Msg');
const config = require('../config')
var fs=require('fs');
var FormData = require('form-data');
var request = require('request')


async function binding(seId ,openId)
{
  var se = await db.SEList.findOne({where: {SEID:seId}})
  if(se){
    var newID = {
      OpenID: openId
    }
    await db.SEList.update(newID,{where: {SEID:seId}})
    return 200
  } else{
    return 400
  }
}

async function checkSE(openId)
{
  var se = await db.SEList.findOne({where: {OpenID:openId}})
  if(se){
    
    return se.SEID
  } else{
    return ""
  }
}
/*async setOpenID (req, res) {
  try {
    if(!await SEList.findOne({where: {SEID:req.body.SEID}})){
      res.status(200).send({
        code: 200,
        message: 'SE不存在'
      })
    }
    else{
      if(await SEList.findOne({where: {SEID:req.body.SEID, OpenID:req.body.OpenID}})){
        res.status(200).send({
          code: 200,
          message: 'OpenID无变化'
        })
      }
      else{
      

        res.status(200).send({
          code: 200,
          message: 'OpenID已更新'
        })
      }
    }
    logger.logger.info("Update OpenID: "+req.body.SEID+': '+req.body.OpenID)
  } catch (error) {
    res.status(400).send({
      code: 400,
      error: '程序异常: ' + error
    })
    logger.logger.fatal("Update OpenID: "+req.body.SEID+'/'+error)
  }
}*/


module.exports = {  

  
  async actionHandler(req, res, next)
	{
    
    var buffer = [];
    var that = this;
    req.on('data', function (data) {
    buffer.push(data);
    });
    req.on('end', function () {
      var msgXml = Buffer.concat(buffer).toString('utf-8');        
    try
    {
    xml2js.parseString(msgXml, {explicitArray : false}, function(err, json) {
      var result = json.xml
      var toUser = result.ToUserName
      var fromUser = result.FromUserName
      
      if (result.MsgType === "text") {
        res.send(msg.textMsg(toUser, fromUser, msg.message(result.Content)))
      }  
      else if(result.MsgType === "event"&&result.Event==="subscribe") {
        if (typeof(result.EventKey) == "undefined"){
          res.send(msg.welcomeMsg(toUser, fromUser, msg.message("")))
        }else{
          var message = result.EventKey.substr(8, result.EventKey.length)
          binding(message,fromUser).then(code=>
            {
              if(code==200){
                res.send(msg.welcomeMsg(toUser, fromUser, message))
              }else{
                res.send(msg.welcomeMsg(toUser, fromUser, msg.message("unknown")))
              }
            })
          
        }
      } else if(result.MsgType === "event"&&result.Event==="CLICK") {
        res.send(msg.newsMsg(toUser, fromUser, ""))
      } else if(result.MsgType === "event"&&result.Event==="SCAN") {
        binding(result.EventKey,fromUser).then(code=>
          {
            if(code==200){
              res.send(msg.welcomeMsg(toUser, fromUser, result.EventKey))
            }else{
              res.send(msg.welcomeMsg(toUser, fromUser, msg.message("unknown")))
            }
          })
      }
    });   		
    }
    catch (error) {
      logger.logger.error("get user info error: "+error.message)
  }
    })
  
  },
  
  async checkPermission(req, res, next)
	{
    try{
    data =await axios.get(`${config.appInfo.snsurl}/access_token?appid=${config.appInfo.appID}&secret=${config.appInfo.secret}&code=${req.query.code}&grant_type=authorization_code`)    
    var openid =data.data.openid;
    var seid = await checkSE(openid)
    if(seid=="")
    {
      res.send({
        code: 400,
        id: ""
      })
    }else {
      res.send({
        code: 200,
        id: seid
      })
    }
    }catch (error) {
      logger.logger.error("get user info error: "+error.message)
      res.send({
        code: 404,
        id: "",
        error: error.message
      })
    }
  },
  async uploadPermMaterial1(req, res, next){ 
    var uploadUrl = '';
    var material = 'helloworld/public/images/test123.jpg'
    var type ='other'    
    var data = {}
    //var data = 
    var token = '40_UHfEselVhq6RkDWyh3W1VzTBGoKa7E2fQI2VNpCv3d7ISiCyFUutaiZ1YdAtbKNcq28TWz_l5qDddd8UXuDJ99UEe7S0Jr9n9tE_qAuMxFXqPCE8J2ApmvEksL4V8JnH728Be2LrrzfMm7U7YPDjADAKBP'
    try
    {
    /*  material =  {
        "articles": [{
        "title": 'seantest',
        "thumb_media_id": 'cMKarTq2ADDO2t-rc41aj3etS0DthJSfPPRwRRiU_MEZYYRjF7OiRvquSFmSTgYJ',
        "author": 'sean',
        "digest": 'zhaiyao',
        "show_cover_pic": 1,
        "content": 'zheshiceshiwenzhang',
        "content_source_url": 'www.baidu.com',
        "need_open_comment":1,
        "only_fans_can_comment":1
    },
        //若新增的是多图文素材，则此处应还有几段articles结构
    ]
    }*/
  
    if(type === 'other') uploadUrl = config.appInfo.uploadPermOther;
    if(type === 'news'){
      uploadUrl = config.appInfo.uploadPermNews;
      data = material
    }else{
      data.media = fs.createReadStream(material)
    }
    request.post({url: `${uploadUrl}access_token=${token}&type=image`, formData:data}, function(err,response,body){
      if(err) {
          console.log('上传图片失败' , err);
          return
      }
      let rdata = {
          media_id: JSON.parse(response.body).media_id,         
          type: 'image'
      }　　　　　　
         // return rdata
         res.send({
          code: 200,
          id: rdata        
        })
      })   
  }catch (error)
    {
      logger.logger.error("upload error: "+error.message)
    }
  },
  async uploadPermMaterial3(req, res, next){ 
    var uploadUrl = '';
    var material = 'helloworld/public/images/test.jpg'
    var type ='news'    
    var data = {}
    //var data = 
    var token = '40_UHfEselVhq6RkDWyh3W1VzTBGoKa7E2fQI2VNpCv3d7ISiCyFUutaiZ1YdAtbKNcq28TWz_l5qDddd8UXuDJ99UEe7S0Jr9n9tE_qAuMxFXqPCE8J2ApmvEksL4V8JnH728Be2LrrzfMm7U7YPDjADAKBP'
    try
    {
      material =  {
        "articles": [{
        "title": 'seantest',
        "thumb_media_id": 'rg-P4AQ-1Njrj6-brqd5dEQTLot2ogyhX2HwbYEyrPU',
        "author": 'sean',
        "digest": 'zhaiyao',
        "show_cover_pic": 1,
        "content": 'zheshiceshiwenzhang',
        "content_source_url": 'www.baidu.com',
        "need_open_comment":1,
        "only_fans_can_comment":1
    },
        //若新增的是多图文素材，则此处应还有几段articles结构
    ]
    }
    if(type === 'pic') uploadUrl = config.appInfo.uploadPermPics;
    if(type === 'other') uploadUrl = config.appInfo.uploadPermOther;
    if(type === 'news'){
      uploadUrl = config.appInfo.uploadPermNews;
      data = material
    }else{
      data.media = fs.createReadStream(material)
    }
    /*request.post({url: `${uploadUrl}access_token=${token}`, data}, function(err,response,body){
      if(err) {
          console.log('上传图片失败' , err);
          return
      }
      let rdata = {
          media_id: JSON.parse(response.body).media_id,         
          type: 'image'
      }　　　　　　
         // return rdata
         res.send({
          code: 200,
          id: rdata        
        })
      }) */
     var ticket =await axios.post(`${uploadUrl}access_token=${token}`, data, function (error, response, body) {
        if(error!==null){
          reject("获取access_token失败 检查getAccessToken函数");
        }
        resolve(JSON.parse(body));
      });   
      res.send({
        code: 200,
        id: ticket.data        
      })
  }catch (error)
    {
      logger.logger.error("upload error: "+error.message)
    }
  },
  async uploadPermMaterial(req, res, next){ 
    
    var token = '40_4ROYYyfp2I6G6ccvszmNvkfXDKV3RfJc-HdWVDl9MLzxLoIQIe_63v2mrCftpoorDw8bJhzHSz2tHOeIZ2dfSxFMxvvOG36N32mpdRlE52mzft-BOqCbq02Ioq2ADvgeghHlO36IN2fdxokvDOUhAJANYE'
    try
    {
      data =  {
        "touser":"oJVgv6a8CT5JWPbaS-21t2cp_NNk",
        "mpnews":{              
          "media_id":"rg-P4AQ-1Njrj6-brqd5dEVIDdRjwT9hUjUsEphGRd4"               
         },
        "msgtype":"mpnews" 
     }
    
    
     var ticket =await axios.post(`${config.appInfo.sendMessageurl}access_token=${token}`, data, function (error, response, body) {
        if(error!==null){
          reject("获取access_token失败 检查getAccessToken函数");
        }
        resolve(JSON.parse(body));
      });   
      res.send({
        code: 200,
        id: ticket.data        
      })
  }catch (error)
    {
      logger.logger.error("upload error: "+error.message)
    }
  },
  async uploadPermMaterial555(req, res, next){ 
    
    var token = '40_4ROYYyfp2I6G6ccvszmNvkfXDKV3RfJc-HdWVDl9MLzxLoIQIe_63v2mrCftpoorDw8bJhzHSz2tHOeIZ2dfSxFMxvvOG36N32mpdRlE52mzft-BOqCbq02Ioq2ADvgeghHlO36IN2fdxokvDOUhAJANYE'
    try
    {
      data = {
      "filter":{
         "is_to_all":true        
      },
      "mpnews":{
         "media_id":"rg-P4AQ-1Njrj6-brqd5dEVIDdRjwT9hUjUsEphGRd4"
      },
       "msgtype":"mpnews",
       "send_ignore_reprint":0
   }
    
    
     var ticket =await axios.post(`${config.appInfo.sendMessageurl}access_token=${token}`, data, function (error, response, body) {
        if(error!==null){
          reject("获取access_token失败 检查getAccessToken函数");
        }
        resolve(JSON.parse(body));
      });   
      res.send({
        code: 200,
        id: ticket.data        
      })
  }catch (error)
    {
      logger.logger.error("upload error: "+error.message)
    }
  }
  /*async uploadPermMaterial(req, res, next){
    var that = this;
  
    var uploadUrl = '';
    var material = 'helloworld/public/images/test.jpg'
    material = 'C:/shennan/nodeJS/helloworld/public/images/test.jpg'
    var type ='pic'
    var value = fs.readFileSync(material)
    
    var data = {}
    var header ={
      filename: 'test.jpg',
      contentType: 'image/png',
      filelength :value.length
    }
    //var data = 
    var token = '40_hMKTCZTxKAPRzJ1G2ybEWYMQE5Kjuk2mL-dQ9n_ihbOV3r-LAJdvsOFiLlqhYgE9kYogrNjkarxf-WyYVXrslYt42ALB5pK3-ENllkf2hRIHtjedj4jnj4MmoIbwpfOaPRtNH98ZoSi4du-aOQLeAGAHJE'
    try
    {
    if(type === 'pic') uploadUrl = config.appInfo.uploadPermOther;
    if(type === 'other') uploadUrl = config.appInfo.uploadPermOther;
    if(type === 'news'){
      uploadUrl = config.appInfo.uploadPermNews;
      data = material
    }else{
      var str = fs.readFileSync(material)
      data.media = str
      data.filelength =str.length
      data.contentType='image/png'
      data.filename = 'test.jpg'
    }
    var form = new FormData();
    form.append('file', str);//'file'是服务器接受的key

    var headers = form.getHeaders();//这个不能少
   // headers.Cookie = cookie;//自己的headers属性在这里追加
    headers.filename = 'test.jpg'
    headers.filelength =str.length
    uploadUrl ='https://api.weixin.qq.com/cgi-bin/media/upload?'
    var formData = {
      media: fs.createReadStream(material)
   }
    request.post({url: `${uploadUrl}access_token=${token}&type=image`, formData: formData}, function(err,response,body){
      if(err) {
          console.log('上传图片失败' , err);
          return
      }
      let data = {
          media_id: JSON.parse(response.body).media_id,
          local_url: path.join(path.resolve(__dirname, '../upload'), file.filename),
          type: 'image'
      }
　　　　　　　//保存数据库
      MediaModel.create(data).then(res => {
          console.log(`保存图片${res.dataValues.media_id}成功`);
      })
  })
    mediaId =await axios.post(`${uploadUrl}access_token=${token}&type=image`,form, function (error, response, body) {
      if(error!==null){
        reject("获取access_token失败 检查getAccessToken函数");
      }
      resolve(JSON.parse(body));
    });  
    return mediaId
  }catch (error)
    {
      logger.logger.error("upload error: "+error.message)
    }
  }*/
}
