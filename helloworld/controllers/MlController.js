const db = require('../models/Index')


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
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败'
      })
    }
  }
}
