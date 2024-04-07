'use strict'

const { Types } = require("mongoose")
const { product } = require("../product.model")
const { getSelectData, getUnSelectData } = require("../../utils")


const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}
const publicProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null;
    foundShop.isDraft = false;
    foundShop.isPublished = true;
    await foundShop.save();
    return foundShop;
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null;
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    await foundShop.save();
    return foundShop;
}

const searchProducts = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product.find({
        isPublished: true,
        $text: { $search: regexSearch },

    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } }).lean();
    return results;
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products;
}

const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(getUnSelectData(unSelect))
}

const getProductById = async ({ productId }) => {
    return await product.findById(productId).lean();
}

const updateProduct = async ({ productId, payload, model, isNew = true }) => {
    return await model.findByIdAndUpdate(productId, payload, { new: isNew });
}

const checkProducts = async (products) => {
    return await Promise.all(products.map(async item => {
        const foundedProduct = await getProductById({ productId: item.productId });
        if (foundedProduct) {
            return {
                price: foundedProduct.product_price,
                quantity: item.quantity,
                productId: item.productId,
            }
        }
    }))
}

module.exports = {
    findAllDraftForShop,
    findAllPublishForShop,
    publicProductByShop,
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    findProduct,
    updateProduct,
    getProductById,
    checkProducts,
}