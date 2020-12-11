const express = require('express');
const router = express.Router()

module.exports = (app) => {
  router.use(function(req, res, next) {next();});
  app.use('/', router);
  router.use('/se', require('./SE'));
  router.use('/ml', require('./ML'));
  router.use('/general', require('./General'));
  router.use('/user', require('./User'));
  
}


