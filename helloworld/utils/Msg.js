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

exports.newsMsg = function (toUser, fromUser, content) {
    var resultXml = "<xml><ToUserName><![CDATA[" + fromUser + "]]></ToUserName>";
    resultXml += "<FromUserName><![CDATA[" + toUser + "]]></FromUserName>";
    resultXml += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
    resultXml += "<MsgType><![CDATA[news]]></MsgType>";
    resultXml += "<ArticleCount>1</ArticleCount>";
    resultXml += "<Articles><item><Title><![CDATA[seantest]]></Title>";
    resultXml += "<Description><![CDATA[seandescription1]]></Description>";
    resultXml += "<PicUrl><![CDATA[https://baike.baidu.com/pic/%E7%BE%8E%E5%9B%BD%E7%A4%BC%E6%9D%A5%E5%85%AC%E5%8F%B8/10931837/1/4ec2d5628535e5ddebfaea2b74c6a7efcf1b626b?fr=lemma&ct=single#aid=1&pic=4ec2d5628535e5ddebfaea2b74c6a7efcf1b626b]]></PicUrl>";
    resultXml += "<Url><![CDATA[https://baidu.com/]]></Url>";
    resultXml += "</item></Articles></xml>";
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
    }else if(data === "unknown") {
        content = "unknown user with qrcode";
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