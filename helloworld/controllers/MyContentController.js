const db = require('../models/Index')
const logger = require('../logger/log4')

const Content = db.MyContent
const Category = db.MyContentCategory

module.exports = {
  async getList (req, res) {
    try {console.log('111')
      const data = await Content.findAll()
      
      if (data) {
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
      if(await Content.findOne({where: {SEID:req.body.ContentID}})){
        res.status(200).send({
          code: 400,
          message: 'Content已经存在'
        })
      }
      else{
        var newContent = {
          ContentID: req.body.ContentID,
          SEID: req.body.SEID,
          SearchTerm: req.body.SearchTerm,
          ContentCategory: req.body.ContentCategory,
          ShortTitle: req.body.ShortTitle,
          ContentMessage: req.body.ContentMessage,
          CreateDt: req.body.TimeStamp
        }
        await Content.create(newContent)
      }
      
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
      logger.logger.fatal("Create Content fail: "+newSE.SEID+'/'+error)
    }
  }
}
