const router = require('express').Router()

router.use('/', require('./Geo'));
router.use('/', require('./Hospital'));
router.use('/', require('./Team'));
router.use('/', require('./Log'));

module.exports = router;