const MyContentController = require('../../controllers/MyContentController')
const router = require('express').Router()
const config = require('../../config')
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')
var ueditor = require('ueditor');
var path = require("path")
/*
router.use(function(req, res, next) 
{
    // AuthenticatePolicy.isValidToken(req,res, next)  
    next() 
})*/
router.get('/getList', MyContentController.getList)
router.get('/getContentByPk', MyContentController.getContentByPk)
router.get('/getFileList', MyContentController.getFileList)
router.get('/getCategory', MyContentController.getCategory)
router.get('/delete',MyContentController.delete)
router.post('/create', MyContentController.create)
router.post('/update', MyContentController.update)
router.post('/createPdf', MyContentController.createPdf)
router.get('/deleteFile',MyContentController.deleteFile)
//router.post('/deletePdf', MyContentController.deletePdf)
router.post('/imageUpload', MyContentController.imageUpload)
router.post('/photoUpload', ueditor(path.join(__dirname, '../../public'), function (req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
 
        var imgname = req.ueditor.filename;
 
        var img_url = '/images';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/jsp/config.json');
        // var img_url = '/images';
        // res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        // res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
}))
router.get('/photoUpload',ueditor(path.join(__dirname, '../../public'), function (req, res, next) {

    if (req.query.action === 'listimage') {
        var dir_url = '/images';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send({
            /* 上传图片配置项 */
            "imageActionName": "uploadimage", /* 执行上传图片的action名称 */
            "imageFieldName": "upfile", /* 提交的图片表单名称 */
            "imageMaxSize": 2048000, /* 上传大小限制，单位B */
            "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 上传图片格式显示 */
            "imageCompressEnable": true, /* 是否压缩图片,默认是true */
            "imageCompressBorder": 1600, /* 图片压缩最长边限制 */
            "imageInsertAlign": "none", /* 插入的图片浮动方式 */
            "imageUrlPrefix": config.host, /* 图片访问路径前缀 */
            "imagePathFormat": "/ueditor/php/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
                                        /* {filename} 会替换成原文件名,配置这项需要注意中文乱码问题 */
                                        /* {rand:6} 会替换成随机数,后面的数字是随机数的位数 */
                                        /* {time} 会替换成时间戳 */
                                        /* {yyyy} 会替换成四位年份 */
                                        /* {yy} 会替换成两位年份 */
                                        /* {mm} 会替换成两位月份 */
                                        /* {dd} 会替换成两位日期 */
                                        /* {hh} 会替换成两位小时 */
                                        /* {ii} 会替换成两位分钟 */
                                        /* {ss} 会替换成两位秒 */
                                        /* 非法字符 \ : * ? " < > | */
                                        /* 具请体看线上文档: fex.baidu.com/ueditor/#use-format_upload_filename */
            /* 涂鸦图片上传配置项 */
            "scrawlActionName": "uploadscrawl", /* 执行上传涂鸦的action名称 */
            "scrawlFieldName": "upfile", /* 提交的图片表单名称 */
            "scrawlPathFormat": "/ueditor/php/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
            "scrawlMaxSize": 2048000, /* 上传大小限制，单位B */
            "scrawlUrlPrefix": "", /* 图片访问路径前缀 */
            "scrawlInsertAlign": "none",
            /* 截图工具上传 */
            "snapscreenActionName": "uploadimage", /* 执行上传截图的action名称 */
            "snapscreenPathFormat": "/ueditor/php/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
            "snapscreenUrlPrefix": "", /* 图片访问路径前缀 */
            "snapscreenInsertAlign": "none", /* 插入的图片浮动方式 */
            /* 抓取远程图片配置 */
            "catcherLocalDomain": ["127.0.0.1", "localhost", "img.baidu.com"],
            "catcherActionName": "catchimage", /* 执行抓取远程图片的action名称 */
            "catcherFieldName": "source", /* 提交的图片列表表单名称 */
            "catcherPathFormat": "/ueditor/php/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
            "catcherUrlPrefix": "", /* 图片访问路径前缀 */
            "catcherMaxSize": 2048000, /* 上传大小限制，单位B */
            "catcherAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 抓取图片格式显示 */
            /* 上传视频配置 */
            "videoActionName": "uploadvideo", /* 执行上传视频的action名称 */
            "videoFieldName": "upfile", /* 提交的视频表单名称 */
            "videoPathFormat": "/ueditor/php/upload/video/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
            "videoUrlPrefix": "", /* 视频访问路径前缀 */
            "videoMaxSize": 102400000, /* 上传大小限制，单位B，默认100MB */
            "videoAllowFiles": [
                ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
                ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid"], /* 上传视频格式显示 */
            /* 上传文件配置 */
            "fileActionName": "uploadfile", /* controller里,执行上传视频的action名称 */
            "fileFieldName": "upfile", /* 提交的文件表单名称 */
            "filePathFormat": "/ueditor/php/upload/file/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
            "fileUrlPrefix": "", /* 文件访问路径前缀 */
            "fileMaxSize": 51200000, /* 上传大小限制，单位B，默认50MB */
            "fileAllowFiles": [
                ".png", ".jpg", ".jpeg", ".gif", ".bmp",
                ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
                ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
                ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
                ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
            ], /* 上传文件格式显示 */
            /* 列出指定目录下的图片 */
            "imageManagerActionName": "listimage", /* 执行图片管理的action名称 */
            "imageManagerListPath": "/ueditor/php/upload/image/", /* 指定要列出图片的目录 */
            "imageManagerListSize": 20, /* 每次列出文件数量 */
            "imageManagerUrlPrefix": config.host, /* 图片访问路径前缀 */
            "imageManagerInsertAlign": "none", /* 插入的图片浮动方式 */
            "imageManagerAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 列出的文件类型 */
            /* 列出指定目录下的文件 */
            "fileManagerActionName": "listfile", /* 执行文件管理的action名称 */
            "fileManagerListPath": "/ueditor/php/upload/file/", /* 指定要列出文件的目录 */
            "fileManagerUrlPrefix": "", /* 文件访问路径前缀 */
            "fileManagerListSize": 20, /* 每次列出文件数量 */
            "fileManagerAllowFiles": [
                ".png", ".jpg", ".jpeg", ".gif", ".bmp",
                ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
                ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
                ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
                ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
            ] /* 列出的文件类型 */
        })
    }
}))
router.post('/uploadPdf', MyContentController.uploadPdf)
router.get('/downloadpdf', MyContentController.downloadPdf)
// router.get('/downloadImg/:ContentID', MyContentController.downloadImg)

module.exports = router


