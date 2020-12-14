const db = require('../models/Index')
const logger = require('../logger/log4')

const MLList = db.MLList

module.exports = {
  async getList (req, res) {
    try {
      const data = await MLList.findAll()
      if (data) {
        res.status(200).send({
          value: 'MLList',
          data: data
        })
        logger.logger.info('Query ML: '+data.length+' records returned')
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
        logger.logger.error('Query ML: No data found')
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败'
      })
      logger.logger.fatal('Query ML fail: '+error)
    }
  }
}
