const MyPushController = require('../../controllers/MyPushController')
const router = require('express').Router()
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')


router.use(function(req, res, next) 
{
    //AuthenticatePolicy.isValidToken(req,res, next)  
    next() 
})
router.get('/getList', MyPushController.getList)
router.post('/create', MyPushController.create)
router.post('/update', MyPushController.update)
router.get('/delete',MyPushController.delete)

module.exports = router;