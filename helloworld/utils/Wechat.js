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
    return wtoken.data.access_token
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
  initdb()
  {
    try
    {
       var newToken = {
          APPID: config.appInfo.appid,
          APPSecret: config.appInfo.secret,
          APPToken: ''   
       }   
       db.APPList.create(newToken)   
    } catch(error)
    {
      logger.logger.error("init token error: "+error.message)    
    }    
  },

  async uploadPermMaterial(type,material,token){
    var that = this;
    var form = {}
    var uploadUrl = '';
    if(type === 'pic') uploadUrl = api.uploadPermPics;
    if(type === 'other') uploadUrl = api.uploadPermOther;
    if(type === 'news'){
      uploadUrl = api.uploadPermNews;
      data = material
    }else{
      data.media = fs.createReadStream(material);
    }
    var url = uploadUrl + 'access_token=' + token;
    mediaId =await axios.post(`${uploadUrl}access_token=${token}`,data, function (error, response, body) {
      if(error!==null){
        reject("获取access_token失败 检查getAccessToken函数");
      }
      resolve(JSON.parse(body));
    });  
    return mediaId
  },

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
  async uploadImage(token, material){ 
    //var material = 'helloworld/public/images/test123.jpg'   
    var data = {}
    try{ 
      data.media = fs.createReadStream(material)    
      request.post({url: `${config.appInfo.uploadPermOther}access_token=${token}&type=image`, formData:data}, function(err,response,body){
        if(err) {
          logger.logger.error("upload image error: "+err.message)       
        }
        return JSON.parse(response.body).media_id
      })   
    }catch (error)
    {
      logger.logger.error("upload error: "+error.message)
      return ''
    }
  },
  async uploadImageText(token, material,refresh=1){ 
    var data = {}
    //var data = 
    try{
      material = {
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
        },]
      }
      uploadUrl = config.appInfo.uploadPermNews;
      data = material
      var ticket =await axios.post(`${config.appInfo.uploadPermNews}access_token=${token}`, data, function (error, response, body) {
        if(error!==null){
          logger.logger.error("upload image_text error: "+error.message)
          reject(error.message);
        }
        resolve(JSON.parse(body));
      }); 
      if(ticket.data.errcode==42001&&refresh==1){
        token = await updateAccessToken(config.appInfo.appID,config.appInfo.secret)
        return await this.uploadImageText(token, material,0)
      }
      else{
        return ticket.data.media_id  
      }                
    }catch (error)
    {
      logger.logger.error("upload image_text error: "+error.message)
      return ''
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
      return  ticket.data
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
    /*try{
      var apps = await db.APPList.findAll()
      if (apps.length==0)
      {
        this.initdb()
      }
      apps = await db.APPList.findAll()
      apps.forEach(app => 
        {
          updateAccessToken(app.APPID,app.APPSecret)
        })
      
    }catch(error){
      logger.logger.error("update access tokens error: "+error.message) 
    }*/
  }

}
