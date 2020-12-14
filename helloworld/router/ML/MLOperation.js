const MLController = require('../../controllers/MLController')
const router = require('express').Router()
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')

router.use(function(req, res, next) 
{
    AuthenticatePolicy.isValidToken(req,res, next)   
})
router.get('/getList', MLController.getList)

module.exports = router