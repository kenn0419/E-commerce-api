'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const discountController = require('../../controllers/discount.controller');

const router = require('express').Router();


//get amount discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(discountController.getAllProductsWithDiscountCode));

router.use(authentication);

router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodeWithShop));


module.exports = router;