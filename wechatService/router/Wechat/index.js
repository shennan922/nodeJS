const router = require('express').Router()
const Wechat = require('../../controllers/WechatController')

router.use('/getqrcode', Wechat.getQRCode);
//router.use('/init',SignPolicy.isValidWechat)
module.exports = router;