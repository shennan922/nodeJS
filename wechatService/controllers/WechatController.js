const db = require('../models/Index')
const config = require('../config')
const logger = require('../logger/log4')
const NodeRSA = require('node-rsa');
const axios = require('axios')
var urlencode = require('urlencode');

async function updateAccessToken (appId,appSecret)
{
  try {
    //const APP =  db.APPList.findByPk(req.params.id)
    const url = `${config.appInfo.wxapi}/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
    wtoken =await axios.get(url, function (error, response, body) {
      if(error!==null){
				reject("获取access_token失败 检查getAccessToken函数");
			}
			resolve(JSON.parse(body));
		});
    var newToken = {
      APPID: appId,
      APPSecret: appSecret,
      APPToken: wtoken.data.access_token      
    }
    db.APPList.update(newToken,{where:{APPID: appId}})     
  }
  catch(error)
  {
    logger.logger.error("update access token error: "+error.message) 
  }
 
}
async function getAccessToken (timestamp,appId)
{
  try
  {
    // wechat = 'V4AN5dTnfjdedsKPrtBsRFdEUJFVs48aiYSalrL3w1x6dhoimXralgylULYrisCb5cO62+86ywj+T810FOC+SDgI4ZFYnT4PNcOoc1HqV3XB2ES6htB3NTu1bai1YfprSs0CQe25JAH6HXAsCg9GDlAbGmk6xBJn95RM8WLVmhk='
    
     if(Date.now()-timestamp>7200*1000)
     {
       return ''
     }
     else
     {
       const app = await db.APPList.findByPk(appId)
       return app.APPToken
     }
  }
  catch(error)
  {
     logger.logger.error("get access token error: "+error.message) 
  }
}

module.exports = {  
/*  initdb(req, res)
  {
    var newToken = {
      APPID: config.appInfo.appid,
      APPSecret: config.appInfo.secret,
      APPToken: ''      
    }
    db.APPList.create(newToken)           
  },*/
  async getQRCode (req, res) {
    try {
     // await updateAccessToken(config.appInfo.appid,config.appInfo.secret)
      var wechat = req.query.wechat
      wechat = urlencode.decode(wechat,'utf8')
      var privateKey = new NodeRSA(config.keys.privateKey);
      decrypted = privateKey.decrypt(wechat, 'utf8');
      var arr = decrypted.split("&");
      var token = await getAccessToken(arr[1],arr[0])
      data = {"expire_seconds": config.appInfo.expire_seconds, "action_name": "QR_STR_SCENE", "action_info": {"scene": {"scene_str": arr[2]}}}
      ticket =await axios.post(`${config.appInfo.wxapi}/qrcode/create?access_token=${token}`,data, function (error, response, body) {
        if(error!==null){
          reject("获取access_token失败 检查getAccessToken函数");
        }
        resolve(JSON.parse(body));
      });     
      if (ticket) {
        logger.logger.info("return data"+ticket.data.ticket)
        res.status(200).send({
          ticket:config.appInfo.QRurl+ticket.data.ticket
        })
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
      }
    } catch (error) {
      logger.logger.error("get user info error: "+error.message)
      res.status(500).send({
        code: 500,
        error: '数据查询失败'
      })
    }
  },
  async getUsers (req, res) {
    try {
      const user = await User.findByPk(req.params.id)
     
      if (user) {
        logger.logger.info("return data"+user.id)
        res.status(200).send({
          user
        })
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
      }
    } catch (error) {
      logger.logger.error("get user info error: "+error.message)
      res.status(500).send({
        code: 500,
        error: '数据查询失败'
      })
    }
  },
  async pppp(req, res, next)
	{
		wtoken =await axios.get(`${base.wxapi}/token?grant_type=client_credential&appid=${base.appid}&secret=${base.secret}`, function (error, response, body) {
			if(error!==null){
				reject("获取access_token失败 检查getAccessToken函数");
			}
			resolve(JSON.parse(body));
		});
	   res.send(wtoken.data)
	},
    async getusers(req, res, next)
	{
		const token1 = '40_XIaLpyYiJm26PQJqQmiS_j3RSS-KxfWKgvbhUZtfkInFWBWFa-C2catxzAg6bdgKHRVpy5tdNLMjlm46gaGZNjuFXRvtps6ANmqIvGKjYxLb2zWfFIZHllfs-unjhTYjJmkksm5UlyXe4feyPSWiAAAILP'
		wtoken =await axios.get(`${base.wxapi}/user/get?access_token=${token1}&next_openid=`, function (error, response, body) {
			if(error!==null){
				reject("获取access_token失败 检查getAccessToken函数");
			}
			resolve(JSON.parse(body));
		});
	   res.send(wtoken.data)
	},
	async sendmessage(req, res, next)
	{
		const data = {
			"touser":"oJVgv6a8CT5JWPbaS-21t2cp_NNk",
			"template_id":"E0CDsnGUeU_TSXBgiLh6NeAolfwkt-zk7ZzTrGNxsZ0",
			"url":"http://www.baidu.com",  			        
			"data":{
					"first": {
						"value":"恭喜你购买成功！",
						"color":"#173177"
					},
					"keyword1":{
						"value":"巧克力",
						"color":"#173177"
					},
					"keyword2": {
						"value":"39.8元",
						"color":"#173177"
					},
					"keyword3": {
						"value":"2014年9月22日",
						"color":"#173177"
					},
					"remark":{
						"value":"欢迎再次购买！",
						"color":"#173177"
					}
			}
		}
		const token1 = '40_XIaLpyYiJm26PQJqQmiS_j3RSS-KxfWKgvbhUZtfkInFWBWFa-C2catxzAg6bdgKHRVpy5tdNLMjlm46gaGZNjuFXRvtps6ANmqIvGKjYxLb2zWfFIZHllfs-unjhTYjJmkksm5UlyXe4feyPSWiAAAILP'
		wtoken =await axios.post(`${base.wxapi}/message/template/send?access_token=${token1}`,data, function (error, response, body) {
			if(error!==null){
				reject("获取access_token失败 检查getAccessToken函数");
			}
			resolve(JSON.parse(body));
		});
	   res.send(wtoken.data)
	},
  async updateAllTokens()
  {
    try{
      var apps = await db.APPList.findAll()
      apps.forEach(app => 
        {
          updateAccessToken(app.APPID,app.APPSecret)
        })
    }catch(error){
      logger.logger.error("update access tokens error: "+error.message) 
    }
  }

}
