const SeController = require('../../controllers/SEController')
var router = require('express').Router();


router.get('/getList', SeController.getList)
router.get('/delete', SeController.delete)
router.post('/update', SeController.update)
router.post('/create', SeController.create)

module.exports = router