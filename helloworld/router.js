const UserController = require('./controllers/UserController')
const studentController = require('./controllers/StudentController')
const GeneralController = require('./controllers/GeneralController')
const MlController = require('./controllers/MlController')
const SeController = require('./controllers/SeController')
const AuthenticatePolicy = require('./policies/AuthenticatePolicy')

module.exports = (app) => {
  app.post('/users/login', UserController.login)
  app.get('/users/:id',
    // AuthenticatePolicy.isValidToken,
    UserController.getUserById
  )
  app.put('/users/:id', UserController.update)
  app.delete('/users/:id', UserController.delete)
  app.post('/users', UserController.register)

  app.get('/students/list', studentController.list)

  app.get('/general/getTeam', GeneralController.getTeam)
  app.get('/general/getGeoTree', GeneralController.getGeoTree)
  app.get('/general/getHospital', GeneralController.getHospital)
  app.get('/ml/getMlList', MlController.getMlList)
  app.get('/se/getSeList', SeController.getSeList)
  app.get('/se/deleteSE', SeController.deleteSE)
  app.post('/se/updateSE', SeController.updateSE)
  app.post('/se/createSE', SeController.createSE)
}

