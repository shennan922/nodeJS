const GeneralController = require('../../controllers/GeneralController')
const router = require('express').Router()
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')

router.use(function(req, res, next) 
{
    AuthenticatePolicy.isValidToken(req,res, next)   
})
router.get('/getHospital', GeneralController.getHospital)

module.exports = router