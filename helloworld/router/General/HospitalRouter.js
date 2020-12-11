const GeneralController = require('../../controllers/GeneralController')
const router = require('express').Router()


  //router.get('/getHospital/:City', GeneralController.getHospital)
  router.get('/getHospital', GeneralController.getHospital)

  module.exports = router