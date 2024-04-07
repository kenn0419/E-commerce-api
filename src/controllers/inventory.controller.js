'use strict'

const { SuccessResponse } = require("../core/success.response");

class inventoryController {
    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add stock successfully',
            metaData: await ProductFactory.addStockToInventory(req.body),
        }).send(res)
    }
}

module.exports = new inventoryController();