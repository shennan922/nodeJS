const express = require('express');
const router = express.Router()
const SignPolicy = require('../policies/Sign')

module.exports = (app) => {
  router.use(function(req, res, next) {next();});
  app.use('/', router);
  router.use('/',SignPolicy.isValidWechat)
  router.use('/user', require('./User'));
  
}


