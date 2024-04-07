'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const checkoutController = require('../../controllers/checkout.controller');

const router = require('express').Router();


//Authentication
router.use(authentication);
router.post('/review', checkoutController.checkoutReview);


module.exports = router;