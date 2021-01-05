const MyContentController = require('../../controllers/MyContentController')
const router = require('express').Router()
const config = require('../../config')

router.get('/:ContentID', MyContentController.downloadImg)
module.exports = router;