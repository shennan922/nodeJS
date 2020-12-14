const MLController = require('../../controllers/MLController')
const router = require('express').Router()

router.get('/getList', MLController.getList)

module.exports = router