const axios = require('axios')
const crypto = require('crypto')
const base = require('../config').appInfo
async function  getAccessToken(){
	try
	{
	/*var wtoken = new Promise((resolve, reject)=>{
		await axios.get(`${base.wxapi}/token?grant_type=client_credential&appid=${base.appid}&secret=${base.secret}`, function (error, response, body) {
			if(error!==null){
				reject("获取access_token失败 检查getAccessToken函数");
			}
			resolve(JSON.parse(body));
		});
	});*/
	wtoken =await axios.get(`${base.wxapi}/token?grant_type=client_credential&appid=${base.appid}&secret=${base.secret}`, function (error, response, body) {
		if(error!==null){
			reject("获取access_token失败 检查getAccessToken函数");
		}
		resolve(JSON.parse(body));
	});
	return wtoken
}catch (err)
{
	console.log(err)
}
}
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
	}
	
  }