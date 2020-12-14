
const crypto = require('crypto')
const base = require('../config').appInfo

module.exports = {
	isValidWechat (req, res, next) {
		var signature = req.query.signature;
		var timestamp = req.query.timestamp;
		var nonce = req.query.nonce;
		var echostr = req.query.echostr;
	    var token = 'NPsean'
		/*  加密/校验流程如下： */
		//1. 将token、timestamp、nonce三个参数进行字典序排序
		var array = new Array(token,timestamp,nonce);
		array.sort();
		var str = array.toString().replace(/,/g,"");
	  
		//2. 将三个参数字符串拼接成一个字符串进行sha1加密
		var sha1Code = crypto.createHash("sha1");
		var code = sha1Code.update(str,'utf-8').digest("hex");
	  
		//3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
		if(code===signature){
			res.send(echostr)
		}else{
			res.send("error");
		}
	},

	getAccessToken(){
		return new Promise((resolve, reject)=>{
			request.get(`${base.wxapi}/token?grant_type=client_credential&appid=${base.appid}&secret=${base.secret}`, function (error, response, body) {
				if(error!==null){
					reject("获取access_token失败 检查getAccessToken函数");
				}
				resolve(JSON.parse(body));
			});
		});
	}
	
  }