var ueditor = require("ueditor");
const router = require('express').Router()
　　//使用模块
　　//app.use("/api/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    router.use("/upload",  function(req, res, next) {
    console.log("1111111111");
　　// ueditor 客户发起上传图片请求
　　if (req.query.action === 'uploadimage') {
  console.log(222222);
　　var foo = req.ueditor;
　　var imgname = req.ueditor.filename;
　　var img_url = '/ueditor/images/';
        　　res.ue_up(img_url); //你只要输入要保存的地址。保存操作交给ueditor来做
        　　res.setHeader('Content-Type', 'text/html'); //IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
　　//  客户端发起图片列表请求
　　else if (req.query.action === 'listimage') {
  console.log(33333333);
　　var dir_url = '/ueditor/images/';
       　　 res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
　　// 客户端发起其它请求
　　else {
  console.log(444444);
       　console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('../../public/ueditor/nodejs/config.json');
    }
}//加载ueditor 模块
　);
module.exports=router