const express = require('express')
const bodyParser = require('body-parser')
var logger = require('./logger/accessLogger')
const log4 = require('./logger/log4')
const { sequelize } = require('./models')
const schedule = require('./utils/Schedule')
const app = express()
app.all('*', function (req, res, next) {
  // 设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*')
  // 允许的header类型
  res.header('Access-Control-Allow-Headers', 'content-type')
  // 跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  if (req.method.toLowerCase() === 'options') {
    res.send(200)// 让options尝试请求快速结束
  } else { next() }
})
app.use(bodyParser.json())
log4.use(app)
app.use(logger('dev'))
require('./router')(app)
schedule.scheduleForTokens()
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Connection has been established successfully.')
    app.listen(3000, () => console.log(`Server has been started on port 3000`))
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
