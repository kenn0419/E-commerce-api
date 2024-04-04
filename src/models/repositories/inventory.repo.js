'use strict'

const { Types } = require("mongoose")
const inventoryModel = require("../inventory.model")

const insertInventory = async ({ productId, shopId, stock, location = 'Unknow' }) => {
    return await inventoryModel.create({
        inven_productId: new Types.ObjectId(productId),
        inven_shopId: new Types.ObjectId(shopId),
        inven_stock: stock,
        inven_location: location,

    })
}

module.exports = {
    insertInventory,
}