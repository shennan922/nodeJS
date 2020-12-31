const MyContentController = require('../../controllers/MyContentController')
const router = require('express').Router()
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')
//const app = express()

router.use(function(req, res, next) 
{
    // AuthenticatePolicy.isValidToken(req,res, next)  
    next() 
})
router.get('/getList', MyContentController.getList)
router.get('/getCategory', MyContentController.getCategory)
router.post('/create', MyContentController.create)
router.post('/update', MyContentController.update)
router.post('/createPdf', MyContentController.createPdf)
router.post('/photoUpload', MyContentController.photoUpload)
router.get('/photoUpload', MyContentController.testImg)

module.exports = router

//使用ueditor模块
// app.use("/api/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
//   // ueditor 客户发起上传图片请求
//   if (req.query.action === 'uploadimage') {
//     //console.log(1);
//     var foo = req.ueditor;

//     var imgname = req.ueditor.filename;

//     var img_url = '/ueditor/images/';//保存在项目文件夹中，你也可以设置绝对路径保存在项目外的文件夹中
//     res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
//     res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
//   }
//   //  客户端发起图片列表请求
//   else if (req.query.action === 'listimage') {
//     var dir_url = '/ueditor/images/';
//     res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
//   }
//   // 客户端发起其它请求
//   else {
//     //console.log('config.json')
//     res.setHeader('Content-Type', 'application/json');
//     res.redirect('/nodejs/config.json');
//   }
// }));
