const express = require('express');
const router = express.Router()

module.exports = (app) => {
  router.use(function(req, res, next) {next();});
  router.use('/wechat', require('./WeChat'));
  router.use('/se', require('./SE'));
  router.use('/ml', require('./ML'));
  router.use('/general', require('./General'));
  router.use('/user', require('./User'));
  app.use('/', router);
  
}


