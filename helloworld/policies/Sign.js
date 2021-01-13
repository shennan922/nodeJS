const axios = require('axios')
const crypto = require('crypto')
const base = require('../config').appInfo
var urlencode = require('urlencode');
async function  getAccessToken(){
	try
	{
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
		var array = new Array(token,timestamp,nonce);
		array.sort();
		var str = array.toString().replace(/,/g,"");
		var sha1Code = crypto.createHash("sha1");
		var code = sha1Code.update(str,'utf-8').digest("hex");
		if(code===signature){
			res.send(echostr)
		}else{
			res.send("error");
		}
	},
	isValidMeeting (req, res, next) {
		var signature = req.headers.signature;
		var timestamp = req.headers.timestamp;
		var nonce = req.headers.nonce;
		var echostr = urlencode.decode(req.query.check_str,'utf8')
	    var token = 'HDo8lS6meulLM1Vxtld2qzEh1'
		var array = new Array(token,timestamp,nonce,echostr);
		array.sort();
		var str = array.toString().replace(/,/g,"");
		var sha1Code = crypto.createHash("sha1");
		var code = sha1Code.update(str,'utf-8').digest("hex");
		if(code===signature){
			var b = new Buffer.from(echostr, 'base64')
            var s = b.toString();
			res.send(s)
		}else{
			res.send("error");
		}
	}
		
  }