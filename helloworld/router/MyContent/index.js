const MyContentController = require('../../controllers/MyContentController')
const router = require('express').Router()
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')

router.use(function(req, res, next) 
{
    AuthenticatePolicy.isValidToken(req,res, next)   
})
router.get('/getList', MyContentController.getList)
router.get('/getCategory', MyContentController.getCategory)
router.post('/create', MyContentController.create)

module.exports = router