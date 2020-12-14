const SeController = require('../../controllers/SEController')
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')
var router = require('express').Router();

router.use(function(req, res, next) 
{
    AuthenticatePolicy.isValidToken(req,res, next)   
})
router.get('/getList', SeController.getList)
router.get('/delete', SeController.delete)
router.post('/update', SeController.update)
router.post('/create', SeController.create)

module.exports = router