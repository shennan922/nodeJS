const LogController = require('../../controllers/LogController')
var router = require('express').Router();
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')

router.use(function(req, res, next) 
{
    //AuthenticatePolicy.isValidToken(req,res, next)   
    next() 
})
router.get('/getLog', LogController.getLog)
router.get('/getLogList', LogController.getLogList)

module.exports = router

