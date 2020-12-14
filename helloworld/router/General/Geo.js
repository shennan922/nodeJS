const GeneralController = require('../../controllers/GeneralController')
var router = require('express').Router();
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')

router.use(function(req, res, next) 
{
    AuthenticatePolicy.isValidToken(req,res, next)   
})
router.get('/getGeoTree', GeneralController.getGeoTree)

module.exports = router
