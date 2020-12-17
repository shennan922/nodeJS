exports.textMsg = function (toUser, fromUser, content) {
    var resultXml = "<xml><ToUserName><![CDATA[" + fromUser + "]]></ToUserName>";
    resultXml += "<FromUserName><![CDATA[" + toUser + "]]></FromUserName>";
    resultXml += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
    resultXml += "<MsgType><![CDATA[text]]></MsgType>";
    resultXml += "<Content><![CDATA[" + content + "]]></Content></xml>";
    return resultXml;
}
exports.welcomeMsg = function (toUser, fromUser, content) {
    var resultXml = "<xml><ToUserName><![CDATA[" + fromUser + "]]></ToUserName>";
    resultXml += "<FromUserName><![CDATA[" + toUser + "]]></FromUserName>";
    resultXml += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
    resultXml += "<MsgType><![CDATA[text]]></MsgType>";
    resultXml += "<Content><![CDATA[" + content + "]]></Content></xml>";
    return resultXml;
}
exports.message = function (data) {
    console.log(data)
    var content;
    if (data === "np") {
        content = "welcome np test account!"
    } 
    else if(data === ""){ 
        content = "hello cute"
    }else {
        content = ".......";
    }
    return content;
}
exports.imgMsg = function(toUser, fromUser, media_id) {
    var xmlContent = "<xml><ToUserName><![CDATA["+ toUser +"]]></ToUserName>";
        xmlContent += "<FromUserName><![CDATA["+ fromUser +"]]></FromUserName>";
        xmlContent += "<CreateTime>"+ new Date().getTime() +"</CreateTime>";
        xmlContent += "<MsgType><![CDATA[image]]></MsgType>";
        xmlContent += "<Image><MediaId><![CDATA["+ media_id +"]]></MediaId></Image></xml>";
    return xmlContent; 
}