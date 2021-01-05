//const MyContentController = require('../../controllers/MyContentController')
const DownloadController = require('../../controllers/DownloadController')
const router = require('express').Router()
const config = require('../../config')

router.get('/:ContentID', DownloadController.downloadImg)
router.get('/downloadpdf', DownloadController.downloadPdf)
router.get('/downloadImg/:ContentID', DownloadController.downloadImg)
module.exports = router;