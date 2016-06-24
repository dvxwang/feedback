'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/lecture', require('./lecture'));
router.use('/question', require('./question'));
router.use('/poll', require('./poll'));
// router.use('/feedback', require('./feedback'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
