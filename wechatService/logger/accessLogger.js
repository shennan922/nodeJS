var accessLogger = require('morgan');
var path = require('path')
var fs=require('fs');
var FileStreamRotator = require('file-stream-rotator')
var logDirectory = path.join('../', 'logs')

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogfile = FileStreamRotator.getStream({
  date_format: 'YYYY-MM-DD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})



Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

accessLogger.token('from', function(req, res){
  return JSON.stringify(req.query) || '-';
});

accessLogger.token('time', function(req, res){
  return new Date().Format("yyyy-MM-dd hh:mm:ss"); 
});

accessLogger.token('nextROw', function(req, res){
  return "\r\n"; 
});

// 自定义format，其中包含自定义的token
accessLogger.format('access', '[access] :time :remote-addr :remote-user :method :url :from :status :referrer :response-time ms :user-agent :nextROw');

module.exports = accessLogger;
