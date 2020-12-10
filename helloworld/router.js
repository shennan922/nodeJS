const UserController = require('./controllers/UserController')
const studentController = require('./controllers/StudentController')
const GeneralController = require('./controllers/GeneralController')
const MlController = require('./controllers/MlController')
const SeController = require('./controllers/SeController')
const AuthenticatePolicy = require('./policies/AuthenticatePolicy')
const express = require('express');
const router = express.Router()

module.exports = (app) => {

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

  router.get('/students/list', studentController.list)

  router.get('/general/getTeam', GeneralController.getTeam)
  router.get('/general/getGeoTree', GeneralController.getGeoTree)
  router.get('/general/getHospital', GeneralController.getHospital)
  router.get('/ml/getMlList', MlController.getMlList)
  router.get('/se/getSeList', SeController.getSeList)
  router.get('/se/deleteSE', SeController.deleteSE)
  router.post('/se/updateSE', SeController.updateSE)
  router.post('/se/createSE', SeController.createSE)
  app.use('/', router);
}

