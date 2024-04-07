'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const inventoryController = require('../../controllers/inventory.controller');

const router = require('express').Router();


//get amount discount

router.use(authentication);
router.post('', asyncHandler(inventoryController.addStockToInventory));


module.exports = router;