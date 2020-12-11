const router = require('express').Router()

router.use('/geo', require('./GeoRouter'));
router.use('/hospital', require('./HospitalRouter'));
router.use('/team', require('./TeamRouter'));

module.exports = router;