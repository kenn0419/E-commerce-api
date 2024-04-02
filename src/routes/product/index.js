'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const ProductController = require('../../controllers/product.controller');
const productController = require('../../controllers/product.controller');

const router = require('express').Router();

router.get('/search/:keySearch', ProductController.getListSearchProduct);
router.use(authentication);

router.post('/', asyncHandler(ProductController.createProduct));

router.put('/publish/:id', asyncHandler(ProductController.publishProductByShop));
router.put('/un-publish/:id', asyncHandler(ProductController.unPublishProductByShop));

//query
router.get('/draft/all', asyncHandler(productController.getAllDraftForShop))
router.get('/publish/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router;