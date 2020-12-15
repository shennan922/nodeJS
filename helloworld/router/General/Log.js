const LogController = require('../../controllers/LogController')
var router = require('express').Router();
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')

router.use(function(req, res, next) 
{
    AuthenticatePolicy.isValidToken(req,res, next)   
})
router.get('/getLog', LogController.readLog)

module.exports = router
