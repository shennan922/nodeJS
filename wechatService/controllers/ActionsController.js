const db = require('../models/Index')
const config = require('../config')
const logger = require('../logger/log4')
const NodeRSA = require('node-rsa');
const axios = require('axios')
const xml2js = require('xml2js');
const msg = require('./Msg');
const urlencode = require('urlencode');
const { json } = require('express');


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
        
    var test = `<xml>
    <ToUserName>me</ToUserName>  
    <FromUserName>me</FromUserName>  
    <CreateTime>1442401156</CreateTime>  
    <MsgType>text</MsgType>  
    <Event>me</Event>  
    <Content>this is a test</Content>
    <ExpiredTime>1442401156</ExpiredTime> 
  </xml>`
    try
    {
    xml2js.parseString(msgXml, {explicitArray : false}, function(err, json) {
      var result = json.xml
      var toUser = result.ToUserName;
      var fromUser = result.FromUserName;
      
      if (result.MsgType === "text") {
        res.send(msg.textMsg(toUser, fromUser, msg.message(result.Content)));
      }  
      else if(result.MsgType === "event"&&result.Event==="subscribe") 
      {
        if (typeof(result.EventKey) == "undefined"){
          res.send(msg.welcomeMsg(toUser, fromUser, msg.message("")));
        }else{
          var message = result.EventKey.substr(8, result.EventKey.length);
          res.send(msg.welcomeMsg(toUser, fromUser, message));
        }
      }
    //  console.log(json)
    });
   
		
    //res.send({code:200,data:json})
    }
    catch (error) {
      logger.logger.error("get user info error: "+error.message)
  }
    })
  
	}
}
