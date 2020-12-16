const express = require('express');
const router = express.Router()
const SignPolicy = require('../policies/Sign')
const ActionsHandler = require('../controllers/ActionsController')

module.exports = (app) => {
  router.use(function(req, res, next) {next();});
  app.use('/', router);
  router.use('/wechat',require('./Wechat'))
 // router.use('/send',SignPolicy.sendmessage)
  router.get('/',SignPolicy.isValidWechat)
  router.post('/',ActionsHandler.actionHandler)
 // router.use('/user', require('./User'));
  
}


