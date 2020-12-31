const MyContentController = require('../../controllers/MyContentController')
const router = require('express').Router()
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')
/*
router.use(function(req, res, next) 
{
    AuthenticatePolicy.isValidToken(req,res, next)   
})*/
router.get('/getList', MyContentController.getList)
router.get('/getFileList', MyContentController.getFileList)
router.get('/getCategory', MyContentController.getCategory)
router.get('/delete',MyContentController.delete)
router.post('/create', MyContentController.create)
router.post('/update', MyContentController.update)
router.post('/createPdf', MyContentController.createPdf)
router.get('/downloadPdf', MyContentController.downloadPdf)


module.exports = router