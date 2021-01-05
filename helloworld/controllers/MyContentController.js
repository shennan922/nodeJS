const db = require('../models/Index')
const logger = require('../logger/log4')
var fs=require('fs');
var ueditor = require('ueditor');
const Content = db.MyContent
const ContentFile = db.MyContentFile
const Category = db.MyContentCategory
const SEList = db.SEList

Content.belongsTo(SEList, {
  foreignKey: 'SEID',
  targetKey: 'SEID',
  as: 'SE'
});

module.exports = {
  async getList (req, res) {
    try {
      var data = await Content.findAll({
        attributes:['ContentID','SEID','SearchTerm','ContentCategory','ShortTitle','ContentMessage','CreateDt','ModifyDt','PhotoName','PhotoPath'],
        include:[
          {
            model: SEList,
            attributes: ['SEName'],
            as: 'SE'
          }
        ],
        raw: true
      })
      
      if (data) {
        data = JSON.parse(JSON.stringify(data).replace(/SE.SEName/g, 'SEName'))
        res.status(200).send({
          value: 'MyContentList',
          data: data
        })
        logger.logger.info('Query MyContent: '+data.length+' records returned')
      } else {
        res.status(200).send({
          code: 200,
          error: '没有找到对应数据'
        })
        logger.logger.error('Query MyContent: No data found')
      }
    } catch (error) {
      res.status(400).send({
        code: 400,
        error: '数据查询失败'
      })
      logger.logger.fatal('Query MyContent fail: '+error)
    }
  },
  async getCategory (req, res) {
    try {
      const data = await Category.findAll()
      if (data) {
        res.status(200).send({
          value: 'MyContentCategory',
          data: data
        })
        logger.logger.info('Query MyContentCategory: '+data.length+' records returned')
      } else {
        res.status(200).send({
          code: 200,
          error: '没有找到对应数据'
        })
        logger.logger.error('Query MyContentCategory: No data found')
      }
    } catch (error) {
      res.status(400).send({
        code: 400,
        error: '数据查询失败'
      })
      logger.logger.fatal('Query MyContentCategory fail: '+error)
    }
  },
  async getFileList (req, res) {
    try {
      const data = await ContentFile.findAll({where:{ContentID:req.query.ContentID}})
      if (data) {
        res.status(200).send({
          value: 'MyContentFile',
          data: data
        })
        logger.logger.info('Query MyContentFile: '+data.length+' records returned')
      } else {
        res.status(200).send({
          code: 200,
          error: '没有找到对应数据'
        })
        logger.logger.error('Query MyContentFile: No data found')
      }
    } catch (error) {
      res.status(400).send({
        code: 400,
        error: '数据查询失败'
      })
      logger.logger.fatal('Query MyContentFile fail: '+error)
    }
  },
  async create (req, res) {
    try {   
      var maxID = await Content.findOne({attributes: [[db.Sequelize.fn('max', db.Sequelize.col('ContentID')),'maxID']]})
      var newContent = {
        ContentID: req.body.ContentID,//maxID.dataValues.maxID+1,
        SEID: req.body.SEID,
        SearchTerm: req.body.SearchTerm,
        ContentCategory: req.body.ContentCategory,
        ShortTitle: req.body.ShortTitle,
        ContentMessage: req.body.ContentMessage,
        CreateDt: req.body.TimeStamp,
        PhotoName:req.body.PhotoName,
        PhotoPath:req.body.PhotoPath,
      }
      await Content.create(newContent)      
      
      res.status(200).send({
        code: 200,
        message: 'Content创建成功'
      })
      logger.logger.info("Create Content: "+newContent.ContentID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      logger.logger.fatal("Create Content fail: "+newContent.SEID+'/'+error)
    }
  },
  async uploadPdf(req,res){
    let form = new formidable.IncomingForm()
    form.encoding = 'utf-8' // 编码
    form.keepExtensions = true // 保留扩展名
    form.parse(req, async (err, fields, files) => {
      if(err) return next(err)
      
      var pathNew = './/contents//'+fields.ContentID
      var pathFUll = pathNew + '//'+files.file.name
      fs.mkdir(pathNew,{recursive:true},(err)=>{
        if(err){
            throw err;
        }else{
            console.log('ok!');
        }
      });
      fs.rename(files.file.path,pathFUll,(err)=>{if(err) return next(err)})

      var newContentFile = {
        ContentID: fields.ContentID,
        FileID: fields.FileID,
        FileName: files.file.name,
        FilePath: pathNew,
        FileURL: 'http://localhost:3000/myContent/downloadpdf?file='+pathFUll,
        CreateDt: fields.UploadTime
      }
      await ContentFile.create(newContentFile).catch((e)=>{console.log(e)})
    })
    
    


    

    res.status(200).send({
      code: 200,
      message: 'Content创建成功',
      data: 'success upload'
    })
  },
  
  async update (req, res) {
    try {
      var newContent = {
        SEID: req.body.SEID,
        SearchTerm: req.body.SearchTerm,
        ContentCategory: req.body.ContentCategory,
        ShortTitle: req.body.ShortTitle,
        ContentMessage: req.body.ContentMessage,
        ModifyDt: req.body.TimeStamp,
        PhotoName:req.body.PhotoName,
        PhotoPath:req.body.PhotoPath,
      }
      await Content.update(newContent,{where:{ContentID: req.body.ContentID}})
      
      res.status(200).send({
        code: 200,
        message: 'Content更新成功'
      })
      logger.logger.info("Update Content: "+newContent.ContentID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      logger.logger.fatal("Update Content fail: "+newContent.ContentID+'/'+error)
    }
  },

  async createPdf(req, res) {
    try {
      console.log('req.body==>', req.body.file);
      var path = './/contents//'+req.body.file[0].ContentID
      fs.mkdir(path,{recursive:true},(err)=>{
        if(err){
            throw err;
        }else{
            console.log('ok!');
        }
      });

      req.body.file.forEach(async file => {
        var fullPath = path+'//'+file.FileName
        var base64Data = file.FileData.replace(/^data:application\/pdf;base64,/, "");
        var dataBuffer = Buffer.from(base64Data, 'base64');
        fs.writeFile(fullPath, dataBuffer,function(err) {
          if(err){
            logger.logger.fatal(err);
          }else{
            logger.logger.info('success~');
          }
        })

        var newContentFile = {
          ContentID: file.ContentID,
          FileID: file.FileID,
          FileName: file.FileName,
          FilePath: path,
          FileURL: 'http://localhost:3000/myContent/downloadpdf?file='+fullPath,
          CreateDt: file.UploadTime
        }
        await ContentFile.create(newContentFile).catch((e)=>{console.log(e)})
      });  

      res.status(200).send({
        code: 200,
        message: 'Content创建成功',
        data: 'success upload'
      })
    } 
    catch (error) {
      res.status(400).send({
        code: 400,
        error: '程序异常: ' + error
      })
      //logger.logger.fatal("Create Content fail: " + newContent.ContentID + '/' + error)
    }
  },
  async downloadImg(req, res) {    
    res.set({
      "Content-Type":"application/jpeg",//告诉浏览器这是一个二进制文件
      "Content-Disposition":"attachment; filename=xxx.jpg"//告诉浏览器这是一个需要下载的文件      
    });  

    fs.createReadStream('helloworld/public/images/'+req.params.ContentID).pipe(res); 
    /*
    Content.findByPk(req.params.ContentID).then((img)=>{
      fs.createReadStream('.//contents//'+req.params.ContentID+'//'+img.PhotoName).pipe(res);   
    }).catch((err)=>{
      res.status(400).send({
        code: 400,
        data:null,
        message:'fail: '+err
      })
    })
    */


  },

  async downloadPdf(req, res) {
    res.set({
      "Content-Type":"application/octet-stream;charset=base64",//告诉浏览器这是一个二进制文件
      "Content-Disposition":"attachment; filename=xxx.pdf"//告诉浏览器这是一个需要下载的文件      
    });
    fs.createReadStream(req.query.file).pipe(res);
  },
  
  async delete (req, res) {
    try {
      await Content.destroy({where: {ContentID: req.query.ContentID}})
      res.status(200).send({
        message: '数据删除成功'
      })
      logger.logger.info("Delete Content: "+newContent.ContentID)
    } 
    catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据删除失败: ' + error
      })
      logger.logger.fatal("Delete Content fail: "+newContent.ContentID+'/'+error)
    }
  },

  async photoUpload(req, res) {
    try {
      if (req.query.action === 'uploadimage') {
        var foo = req.upfile;
       // var imgname = req.upfile.filename;
        var img_url = '/images1/';
        //你只要输入要保存的地址 。保存操作交给ueditor来做
        ueditor.u
        res.ue_up(img_url); 
        res.status(200).send({
          code: 200,
          message: 'Content创建成功' 
        })
    }else
      {
        logger.logger.info('req.body==>', req.body.file);
        console.log('req.body==>', req.body.fileName);
        var base64Data = req.body.file.replace(/^data:image\/jpeg;base64,/, "");
        var dataBuffer = Buffer.from(base64Data, 'base64');
        fs.writeFile('.//images//'+req.body.fileName, dataBuffer,function(err) {
          if(err){
            logger.logger.info(err);
          }else{
            logger.logger.info(err);
          }
        })
        res.status(200).send({
          code: 200,
          message: 'Content创建成功',
          data: req.body.fileName
        })
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      //logger.logger.fatal("Create Content fail: " + newContent.ContentID + '/' + error)
    }
  },
  async testImg (req, res) {
    res.status(200).send({
      /* 上传图片配置项 */
      "imageActionName": "uploadimage", /* 执行上传图片的action名称 */
      "imageFieldName": "upfile", /* 提交的图片表单名称 */
      "imageMaxSize": 2048000, /* 上传大小限制，单位B */
      "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 上传图片格式显示 */
      "imageCompressEnable": true, /* 是否压缩图片,默认是true */
      "imageCompressBorder": 1600, /* 图片压缩最长边限制 */
      "imageInsertAlign": "none", /* 插入的图片浮动方式 */
      "imageUrlPrefix": "", /* 图片访问路径前缀 */
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
      "imageManagerUrlPrefix": "", /* 图片访问路径前缀 */
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
  },
}

