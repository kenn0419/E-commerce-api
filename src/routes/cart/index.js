'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const cartController = require('../../controllers/cart.controller');

const router = require('express').Router();


//Authentication
router.use(authentication);

router.post('', asyncHandler(cartController.addToCart));
router.delete('', asyncHandler(cartController.deleteItemInCart));
router.post('/update', asyncHandler(cartController.updateQuantiTy));
router.get('', asyncHandler(cartController.getListCart));

module.exports = router;