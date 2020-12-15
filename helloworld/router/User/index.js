const router = require('express').Router()

router.use('/', require('./UserOperation'));

module.exports = router;