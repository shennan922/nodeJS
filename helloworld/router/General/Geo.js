const GeneralController = require('../../controllers/GeneralController')
var router = require('express').Router();

router.get('/getGeoTree', GeneralController.getGeoTree)

module.exports = router
