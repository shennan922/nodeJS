const UserController = require('./controllers/UserController')
const AuthenticatePolicy = require('./policies/AuthenticatePolicy')
const express = require('express');
module.exports = (app) => {
  const router = express.Router()
  router.use(function(req, res, next) {
   
    next();
  });
  router.post('/users/login', UserController.login)
  router.get('/users/:id',
    // AuthenticatePolicy.isValidToken,
    UserController.getUserById
  )
  router.put('/users/:id', UserController.update)
  router.delete('/users/:id', UserController.delete)
  router.post('/users', UserController.register)
  app.use('/', router);
}
