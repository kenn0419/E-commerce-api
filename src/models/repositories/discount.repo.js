'use strict'

const discountModel = require("../discount.model");
const { convertToObjectMongoDb, getUnSelectData, getSelectData } = require('../../utils');


const findDiscount = async ({ code, shopId }) => {
    return await discountModel.findOne({
        discount_code: code,
        discount_shopId: convertToObjectMongoDb(shopId),
    }).lean();
}

const findAllDiscountCodesSelect = async ({ limit = 50, sort = 'ctime', page = 1, filter, select, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return documents;
}

const findAllDiscountCodesUnSelect = async ({ limit = 50, sort = 'ctime', page = 1, filter, unSelect, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unSelect))
        .lean()
    return documents;
}

const updateDiscount = async ({ discountId, payload }) => {
    return await discountModel.findByIdAndUpdate(discountId, payload, { new: true });
}

module.exports = {
    findDiscount,
    findAllDiscountCodesSelect,
    findAllDiscountCodesUnSelect,
    updateDiscount,
}