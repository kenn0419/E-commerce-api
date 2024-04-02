'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const ProductController = require('../../controllers/product.controller');

const router = require('express').Router();

router.use(authentication);
router.post('/', asyncHandler(ProductController.createProduct));

module.exports = router;