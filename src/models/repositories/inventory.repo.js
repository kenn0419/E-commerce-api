'use strict'

const { Types } = require("mongoose")
const inventoryModel = require("../inventory.model")
const { convertToObjectMongoDb } = require("../../utils")

const insertInventory = async ({ productId, shopId, stock, location = 'Unknow' }) => {
    return await inventoryModel.create({
        inven_productId: new Types.ObjectId(productId),
        inven_shopId: new Types.ObjectId(shopId),
        inven_stock: stock,
        inven_location: location,

    })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: convertToObjectMongoDb(productId),
        inven_stock: { $gte: quantity }
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = { upsert: true, new: true };
    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
}

module.exports = {
    insertInventory,
    reservationInventory,
}