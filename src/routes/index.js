'use strict'

const { apiKey, permission } = require('../auth/checkAuth');

const router = require('express').Router();

//check apikey
router.use(apiKey);
//check permisson
router.use(permission('0000'));

router.use('/v1/api/product', require('./product'));
router.use('/v1/api', require('./access'));

module.exports = router;