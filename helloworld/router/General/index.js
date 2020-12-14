const router = require('express').Router()

router.use('/geo', require('./Geo'));
router.use('/hospital', require('./Hospital'));
router.use('/team', require('./Team'));

module.exports = router;