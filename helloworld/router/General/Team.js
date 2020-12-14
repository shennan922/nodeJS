const GeneralController = require('../../controllers/GeneralController')
const router = require('express').Router()

router.get('/getTeam', GeneralController.getTeam)

module.exports = router