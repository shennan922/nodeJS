const db = require('../models/Index')
const logger = require('../logger/log4')
var fs=require('fs');
const Content = db.MyContent
const ContentFile = db.MyContentFile
const Category = db.MyContentCategory
const SEList = db.SEList
var formidable = require('formidable')
var weChat = require('../utils/Wechat')
const config = require('../config')
var urlencode = require('urlencode');

Content.belongsTo(SEList, {
  foreignKey: 'SEID',
  targetKey: 'SEID',
  as: 'SE'
});


module.exports = {
  async getContentByPk (req, res) {
    try {
      var data = await Content.findByPk(req.query.id,{
        attributes:['ContentID','SEID','SearchTerm','ContentCategory','ShortTitle','ContentMessage','CreateDt','ModifyDt','PhotoName','PhotoPath'],
        include:[
          {
            model: SEList,
            attributes: ['SEName'],
            as: 'SE'
          }
        ],
        order: [
          ['CreateDt', 'DESC']
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
        order: [
          ['CreateDt', 'DESC']
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
    let token =await weChat.updateAccessToken(config.appInfo.appID,config.appInfo.secret)//await weChat.getAccessToken(Date.now(),config.appInfo.appID)
    var pathNew = './/contents//'+req.body.ContentID+'//'+req.body.PhotoName
    var stat = fs.existsSync(pathNew)
    if(!stat){
      res.status(200).send({
        code: 400,
        message: '图片不存在: '+ req.body.ContentID+'//'+req.body.PhotoName
      })
      logger.logger.error("图片不存在 : "+req.body.ContentID+'//'+req.body.PhotoName) 
      return
    }

    await weChat.uploadImage(token,pathNew).then(async mid =>{  
      if(mid.media_id == undefined){
        res.status(200).send({
          code: 400,
          message: 'media_id生成失败: '+mid.errmsg
        })
        logger.logger.error("media_id生成失败: ")  
        return
      } 

      let newContent = {
        ContentID: req.body.ContentID,
        SEID: req.body.SEID,
        SearchTerm: req.body.SearchTerm,
        ContentCategory: req.body.ContentCategory,
        ShortTitle: req.body.ShortTitle,
        ContentMessage: req.body.ContentMessage,
        CreateDt: db.convertLocalTime(req.body.TimeStamp),
        PhotoName:req.body.PhotoName,
        PhotoPath:req.body.PhotoPath,
        ImgID:mid.media_id,
        ImgUrl:mid.url,
        TextID:null
      }  
      await Content.create(newContent)

      res.status(200).send({
        code: 200,
        message: 'Content创建成功'
      })
      logger.logger.info("Create Content: "+req.body.ContentID)        
    })
    .catch((error)=>{
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      logger.logger.fatal("Create Content fail: "+req.body.ContentID+'/'+error)
    })
  },
  
  async update (req, res) {
    try {
      let newContent = {
        SEID: req.body.SEID,
        SearchTerm: req.body.SearchTerm,
        ContentCategory: req.body.ContentCategory,
        ShortTitle: req.body.ShortTitle,
        ContentMessage: req.body.ContentMessage,
        ModifyDt: db.convertLocalTime(req.body.TimeStamp),
        PhotoName:req.body.PhotoName,
        PhotoPath:req.body.PhotoPath,
      }

      await Content.update(newContent,{where:{ContentID: req.body.ContentID}})
      
      res.status(200).send({
        code: 200,
        message: 'Content更新成功'
      })
      logger.logger.info("Update Content: "+req.body.ContentID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      logger.logger.fatal("Update Content fail: "+req.body.ContentID+'/'+error)
    }
  },

  async uploadPdf(req,res){
    let form = new formidable.IncomingForm()
    form.encoding = 'utf-8' // 编码
    form.keepExtensions = true // 保留扩展名
    form.parse(req, async (error, fields, files) => {
      if(error) {
        res.status(500).send({
          code: 500,
          error: '程序异常: ' + error
        })
        logger.logger.fatal("Create Content fail: "+fields.ContentID+'/'+error)
        return
      }
      
      var pathNew = './/contents//'+fields.ContentID
      var pathFUll = pathNew + '//'+files.file.name
      fs.mkdir(pathNew,{recursive:true},(err)=>{
        if(err){
          logger.logger.fatal(err)
          return
        }
      });
      fs.rename(files.file.path,pathFUll,(err)=>{if(err) {logger.logger.fatal("Create Content fail: "+fields.ContentID+'/'+error)}})
      let maxID = await ContentFile.findOne({attributes: [[db.Sequelize.fn('max', db.Sequelize.col('FileID')),'FileID']],where:{ContentID:fields.ContentID}})

      var newContentFile = {
        ContentID: fields.ContentID,
        FileID: maxID.FileID==undefined?0:maxID.FileID+1,
        FileName: files.file.name,
        FilePath: pathNew,
        FileURL: config.host+'/myContent/downloadpdf?file='+files.file.name+'&ContentID='+fields.ContentID,
        CreateDt: db.convertLocalTime(fields.UploadTime)
      }

      let checkExist = await ContentFile.findOne({where:{ContentID:fields.ContentID,FileName:files.file.name}})
      console.log(checkExist)
      if(checkExist != undefined){
        await ContentFile.update({ModifyDt:db.convertLocalTime(fields.UploadTime)},{where:{ContentID:fields.ContentID,FileName:files.file.name}})
      }
      else{
        await ContentFile.create(newContentFile).catch((e)=>{console.log(e)})
      }

      res.status(200).send({
        code: 200,
        message: 'Content创建成功',
        data: 'success upload'
      })
    })  
  },
  async createPdf(req, res) {
    try {
      //console.log('req.body==>', req.body.file);
      var path = './/contents//'+req.body.file[0].ContentID
      fs.mkdir(path,{recursive:true},(err)=>{
        if(err){
          logger.logger.fatal(err)
          return
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
          FileURL: config.host+'/myContent/downloadpdf?file='+file.FileName+'&ContentID='+file.ContentID,
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

  async downloadPdf(req, res) {
    res.set({
      "Content-Type":"application/octet-stream;charset=base64",//告诉浏览器这是一个二进制文件
      "Content-Disposition": "attachment; filename*=UTF-8''" + urlencode.encode(req.query.file, "UTF-8")//告诉浏览器这是一个需要下载的文件      
    });
    var path = './/contents//'+req.query.ContentID+'//'+req.query.file
    if(fs.existsSync(path)){
      fs.createReadStream(path).pipe(res); 
    }
    else{
      res.status(400).send({
        code: 400,
        data:null,
        message:'文件不存在'
      })
    }
      
  },
  
  async downloadImg(req, res) {    
    try{
      res.set({
        "Content-Type":"application/jpeg",//告诉浏览器这是一个二进制文件
        "Content-Disposition":"attachment; filename="+req.params.ContentID+"\""//告诉浏览器这是一个需要下载的文件      
      });
      
      var path = 'public/images/'+req.params.ContentID
      if(fs.existsSync(path)){
        fs.createReadStream(path).pipe(res); 
      }
      else{
        res.status(400).send({
          code: 400,
          data:null,
          message:'封面图片不存在'
        })
      }
      
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
    }
    catch(err){
      logger.logger.fatal("download UE img fail: " + req.params.ContentID + '/' + err)
    }
  },

  async delete (req, res) {
    try {
      await Content.destroy({where: {ContentID: req.query.ContentID}})
      await ContentFile.destroy({where: {ContentID: req.query.ContentID}})
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

  async deleteFile (req, res) {
    try {
      var path = './/contents//'+req.query.ContentID+'//'+req.query.file
      fs.unlink(path,(err)=>{
        ContentFile.destroy({where: {ContentID: req.query.ContentID,FileName:req.query.file }})
        if(err){logger.logger.fatal("Delete Content fail: "+err)}
        res.status(200).send({
          message: '删除文件成功'
        })
      logger.logger.info("Delete file: "+req.query.ContentID)
      })      
    } 
    catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据删除失败: ' + error
      })
      logger.logger.fatal("Delete file fail: "+req.query.ContentID+'/'+error)
    }
  },

  async imageUpload(req, res) {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true // 保留扩展名
    form.parse(req,  (err, fields, files) => {
      if(err) {
        console.log(err); 
        logger.logger.fatal(err)
      }//return next(err)        
      var pathNew = './/contents//'+fields.ContentID
      var pathFUll = pathNew + '//'+files.file.name
      
      //var stat = fs.statSync(pathNew)
      var stat = fs.existsSync(pathNew)
      if(stat){
        fs.readdirSync(pathNew).forEach(file => {
          if(file.indexOf('.jpg')>0){
            fs.unlink(pathNew+'//'+file, function(err){
              if(err){
                logger.logger.fatal(err+'-'+pathNew+'//'+file)
              }
            })
          }
        });
      }else{
        fs.mkdir(pathNew,{recursive:true},(err)=>{
          if(err){
            logger.logger.fatal(err)
            return
          }
        })
      }

      fs.rename(files.file.path,pathFUll,(err)=>{
        if(err){
          logger.logger.fatal(err)
          return
        }
      })

      res.status(200).send({
        code: 200,
        message: '封面图片创建成功',
        data: req.body.fileName
      })
    })
  },

  async photoUpload(req, res) {
    try {
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
      imageUrl: config.host+"/myContent/photoUpload",
      imagePath: "C:/Workspace/nodeJS_new_1222/helloworld/public/ueditor/images",
      imageFieldName: "upfile",
      imageMaxSize: 2048,
      imageAllowFiles: [".png", ".jpg", ".jpeg", ".gif", ".bmp"]
    })
  },
}

