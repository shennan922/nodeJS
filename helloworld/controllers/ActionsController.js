const db = require('../models/Index')
const logger = require('../logger/log4')
const xml2js = require('xml2js');
const msg = require('../utils/Msg');
const config = require('../config')

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
    
    data =await axios.get(`${config.appInfo.snsurl}/access_token?appid=${config.appInfo.appID}&secret=${config.appInfo.secret}&code=${req.params.code}&grant_type=authorization_code`)    
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
    
  }
}
