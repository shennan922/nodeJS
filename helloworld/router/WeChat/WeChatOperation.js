const router = require('express').Router()
const SignPolicy = require('../../policies/Sign')
const ActionsHandler = require('../../controllers/ActionsController')

/*router.use(function(req, res, next) 
{
    AuthenticatePolicy.isValidToken(req,res, next)   
})*/
router.get('/',SignPolicy.isValidWechat)
router.post('/',ActionsHandler.actionHandler)

module.exports = router