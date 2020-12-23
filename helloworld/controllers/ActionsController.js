//const db = require('../models/Index')
const logger = require('../logger/log4')
const xml2js = require('xml2js');
const msg = require('../utils/Msg');



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
      var toUser = result.ToUserName;
      var fromUser = result.FromUserName;
      
      if (result.MsgType === "text") {
        res.send(msg.textMsg(toUser, fromUser, msg.message(result.Content)));
      }  
      else if(result.MsgType === "event"&&result.Event==="subscribe") {
        if (typeof(result.EventKey) == "undefined"){
          res.send(msg.welcomeMsg(toUser, fromUser, msg.message("")));
        }else{
          var message = result.EventKey.substr(8, result.EventKey.length);
          res.send(msg.welcomeMsg(toUser, fromUser, message));
        }
      } else if(result.MsgType === "event"&&result.Event==="CLICK") {
        res.send(msg.newsMsg(toUser, fromUser, ""));
      }
    });   		
    }
    catch (error) {
      logger.logger.error("get user info error: "+error.message)
  }
    })
  
	}
}
