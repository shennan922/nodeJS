const Meeting = require('../../controllers/MeetingController')
const router = require('express').Router()
const SignPolicy = require('../../policies/Sign')
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')
const ActionsHandler = require('../../controllers/ActionsController')


router.use(function(req, res, next) 
{
    //AuthenticatePolicy.isValidToken(req,res, next)  
    next() 
})
router.get('/',SignPolicy.isValidMeeting)
router.post('/',ActionsHandler.actionMeetingHandler)
router.get('/getList', Meeting.getList)
router.post('/create', Meeting.create)
router.post('/update', Meeting.update)
router.post('/close',Meeting.close)

module.exports = router;