const { time } = require('console');
var fs=require('fs');
var readline = require('readline');

module.exports = {
    async readLog(req, res){
    //函数接受3个参数，日期、精度(天时分秒)和操作（查找、刷新或者默认）
    //date,type,operation,logReadFlag
        if(req.query.date){
        //如果有时间参数则对时间参数进行处理（一般日志名称都是时间加类型）
          //var dataStr = arguments[0];
          var dataStr = req.query.date
          var date = dataStr.slice(0,10);
          var hour = dataStr.slice(11,13);
          var minute = dataStr.slice(11,16);
          var second =dataStr.slice(11,19);
          //var type = arguments[1];
          var type = req.query.type
          //获取精度
        }else{
        //若无时间参数则获取当前时间，然后精度默认
          var date = new Date(+new Date()+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'').slice(0,10);
          var type=null;
        }
        //var op = arguments[2];
        var op = req.query.operation
        var logReadFlag = req.query.logReadFlag
        var countResult = 0;
        //对日志结果进行统计
        var logPath = './/logs//'+'server-.'+date+'.log';
        
        //拼接日志文件名称
        var logStr = '';
        fs.stat(logPath, function (err, stats) {
            console.log('111')
            //获取对应的日志文件状态
            if(err){
            //日志不存在或者异常处理信息
            //$('#logTipInfo tr td').html('无日志信息可供查看');
                var info = '无日志信息可供查看: '+err
                console.log(info)
            }else{
                console.log('333')
                var log = []        
                var lineCount = 0;                
                var fReadName = logPath;
                var fRead = fs.createReadStream(fReadName);
                var objReadline = readline.createInterface({input: fRead});
                //按行读取日志
                objReadline.on('line', (line)=>{
                    var itemStr = line.trim();
                    var time = itemStr.slice(0,25);
                    var content = itemStr.substr(26);
                    if(!time || !content){return;}
                    ++ lineCount;
                    //计数行数
                    var matched = true;
                    var itemStr = line.trim();
                    console.log(itemStr)
                    var itemArr = itemStr.split(' ');
                    var logDate = itemArr[0].slice(1,11);
                    var logTime = itemArr[0].slice(12,20);                    
                    var level = itemArr[1].toString();
                    var time = logDate+' '+logTime;
                    switch(type){
                    //进度查找过滤
                        case '0':
                        //case 'null':
                        case '':
                            matched = true;
                            break;
                        case '1':
                            var timeSplit = logTime.slice(0,2);
                            if(timeSplit == hour){
                            matched = true;
                            break;
                            }
                            matched = false;
                            break;
                        case '2':
                            var timeSplit = logTime.slice(0,5);
                            if(timeSplit == minute){
                            matched = true;
                            break;
                            }
                            matched = false;
                            break;
                        case '3':
                            var timeSplit = logTime.slice(0,8);
                            if(timeSplit == second){
                            matched = true;
                            break;
                            }
                            matched = false;
                            break;
                        default:
                            console.log('unkonw type!');
                            break;
                    }
                    if(matched === true &&(lineCount>logReadFlag)){
                        //日志结果格式化输出呈现
                        countResult ++;    
                        //logStr += level+time+' - '+content+'<br>'
                        log.push({log:itemStr})
                    }
                    
                });
                objReadline.on('close', ()=>{
                    if(logReadFlag == 0 && (logStr == '')){
                        var info = '无日志信息可供查看';
                    }
                    if(logReadFlag >0 && (logStr != '')){
                        var newLogNum = lineCount - logReadFlag;
                        var info = '刷新成功,更新'+newLogNum+'条日志!';
                        //$('#logInfoTable').prepend(logStr);
                    }else if(logReadFlag >0 && (logStr == '')){
                        var info = '刷新成功,无日志更新!';
                    }else{
                        //$('#logInfoTable').html(logStr);
                    }
                    if(op == 'search'){
                        var info = '查找到'+countResult+'条日志';
                    }
                    //$('#logTipInfo tr td').html(info);
                    /*
                    if((op == 'search' || op == 'refresh') &&(logReadFlag != 0 || newLogNum >0 || countResult >0)){
                        //操作结束后给出信息反馈，反馈自动淡出消失
                        setTimeout(function() {$('#logTipInfo').fadeOut(567);}, 2000);                    
                    }
                    else{
                        $('#logTipInfo').hide();
                    }
                    */
                    logReadFlag = lineCount;
                    console.log('closed');

                    res.status(200).send({
                        code: 200,
                        recordCount: logReadFlag,
                        type: type,
                        log: log
                    })
                });
            }
        });
    }
}
