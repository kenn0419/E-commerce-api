'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const ProductController = require('../../controllers/product.controller');

const router = require('express').Router();

router.get('/search/:keySearch', ProductController.getListSearchProduct);
router.get('/', ProductController.findAllProducts);
router.get('/:product_id', ProductController.findProduct);

router.use(authentication);

router.post('/', asyncHandler(ProductController.createProduct));
router.patch('/:productId', asyncHandler(ProductController.updateProduct));

router.put('/publish/:id', asyncHandler(ProductController.publishProductByShop));
router.put('/un-publish/:id', asyncHandler(ProductController.unPublishProductByShop));

//query
router.get('/draft/all', asyncHandler(ProductController.getAllDraftForShop))
router.get('/publish/all', asyncHandler(ProductController.getAllPublishForShop))

module.exports = router;