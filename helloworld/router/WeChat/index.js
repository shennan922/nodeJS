const router = require('express').Router()

router.use('/', require('./WeChatOperation'));

module.exports = router;