const db = require('../models/Index')
const logger = require('../logger/log4')
var fs=require('fs');
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
        attributes:['ContentID','SEID','SearchTerm','ContentCategory','ShortTitle','ContentMessage','CreateDt','ModifyDt'],
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
        CreateDt: req.body.TimeStamp
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
  
  async update (req, res) {
    try {
      var newContent = {
        SEID: req.body.SEID,
        SearchTerm: req.body.SearchTerm,
        ContentCategory: req.body.ContentCategory,
        ShortTitle: req.body.ShortTitle,
        ContentMessage: req.body.ContentMessage,
        ModifyDt: req.body.TimeStamp
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

    } catch (error) {
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
        "Content-Disposition":"attachment; filename=xxx.pdf"//告诉浏览器这是一个需要下载的文件
      
    });
    //fs.createReadStream('./public/file/test.txt').pipe(res);
  

  fs.createReadStream(req.query.file).pipe(res);

 
  },
  
  async delete (req, res) {
    try {
      await Content.destroy(
        {
          where: {
            ContentID: req.query.ContentID
          }
        }
      )
      res.status(200).send({
        message: '数据删除成功'
      })
      logger.logger.info("Delete Content: "+newContent.ContentID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据删除失败: ' + error
      })
      logger.logger.fatal("Delete Content fail: "+newContent.ContentID+'/'+error)
    }
  }
}