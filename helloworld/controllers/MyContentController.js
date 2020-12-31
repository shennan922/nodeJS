const db = require('../models/Index')
const logger = require('../logger/log4')
var fs=require('fs');
const Content = db.MyContent
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
  async create (req, res) {
    try {   
      var maxID = await Content.findOne({attributes: [[db.Sequelize.fn('max', db.Sequelize.col('ContentID')),'maxID']]})
      var newContent = {
        ContentID: maxID.dataValues.maxID+1,
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

  async  createPdf(req, res) {
    try {
      logger.logger.info('req.body==>', req.body.file);
      console.log('req.body==>', req.body.fileName);

      var base64Data = req.body.file.replace(/^data:application\/pdf;base64,/, "");
      var dataBuffer = new Buffer(base64Data, 'base64');
      fs.writeFile('.//contents//'+req.body.fileName, dataBuffer,function(err) {
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
  async photoUpload(req, res) {
    try {
      logger.logger.info('req.body==>', req.body.file);
      console.log('req.body==>', req.body.fileName);

      var base64Data = req.body.file.replace(/^data:image\/jpeg;base64,/, "");
      var dataBuffer = new Buffer(base64Data, 'base64');
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
      imageUrl: "http://localhost:3000/myContent/photoUpload",
      imagePath: "C:/Workspace/nodeJS_new_1222/helloworld/public/ueditor/images",
      imageFieldName: "upfile",
      imageMaxSize: 2048,
      imageAllowFiles: [".png", ".jpg", ".jpeg", ".gif", ".bmp"]
    })
  },

}
