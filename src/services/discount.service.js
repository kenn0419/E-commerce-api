'use strict'
const { BadRequestError, NotFoundError } = require('../core/error.response');
const discountModel = require('../models/discount.model');
const { product } = require('../models/product.model');
const { findDiscount, findAllDiscountCodesUnSelect, updateDiscount } = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectMongoDb } = require('../utils');


class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to,
            name, description, type, value, max_value,
            max_use, uses_count, max_uses_per_user, users_used
        } = payload;
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has error');
        }
        if (new Date(end_date) < new Date(start_date)) {
            throw new BadRequestError('Start date must less than End date');
        }
        //create index for discount code
        const foundedDiscount = await findDiscount({ code, shopId });
        if (foundedDiscount && foundedDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists');
        }
        // const foundedProducts = await product.find({ product_shop: convertToObjectMongoDb(shopId) });
        // if (!foundedProducts) throw new NotFoundError('Shop not existed');
        // //check product_ids belong to shopId ?
        // const checkProduct_ids = product_ids.every(item => foundedProducts.some(el => el !== item));
        // if (!checkProduct_ids) throw new NotFoundError('Shop not have this product');
        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_use: max_use,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
        })
        return newDiscount;
    }
    static async updateDiscount({ discountId, payload }) {
        return await updateDiscount({ discountId, payload });
    }

    //get list subtable products by discount_code
    static async getProductsWithDiscountCode({ code, shopId, limit, page }) {
        const foundedDiscount = await findDiscount({ code, shopId });
        if (!foundedDiscount || !foundedDiscount.discount_is_active) {
            throw new NotFoundError('Discount not existed');
        }
        const { discount_applies_to, discount_product_ids } = foundedDiscount;
        let products;
        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectMongoDb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name', 'product_thumb', 'product_price', 'product_shop']
            })
        }
        return products;
    }

    static async getDiscountsWithShopId({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectMongoDb(shopId),
                discount_is_active: true,
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discountModel
        })
        return discounts;
    }
    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundedDiscount = await findDiscount({ code: codeId, shopId });
        if (!foundedDiscount) throw new NotFoundError('Discount not existed');
        const {
            discount_is_active,
            discount_max_use,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_type,
            discount_max_uses_per_user,
            discount_users_used,
            discount_value,

        } = foundedDiscount;
        if (!discount_is_active) throw new NotFoundError('Discounts has expired');
        if (!discount_max_use) throw new NotFoundError('Discounts are out of stock');
        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundError('Discount code has error');
        }
        let totalOrder = 0;
        if (+discount_min_order_value > 0) {
            totalOrder = products.reduce((total, product) => total + product.price * product.quantity, 0);
            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError('Requires a minium order value of ', discount_min_order_value);
            }
        }
        if (+discount_max_uses_per_user > 0) {
            const userUseDiscount = discount_users_used.find(item => item === userId);
            if (userUseDiscount) {
                throw new BadRequestError('This discount has been used. Please choose other');
            }
        }
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }
    static async deleteDiscountCode({ shopId, codeId }) {
        const deletedDiscount = await discountModel.findOneAndDelete({
            discount_shopId: convertToObjectMongoDb(shopId),
            discount_code: codeId
        })
        return deletedDiscount
    }

    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundedDiscount = await findDiscount({ codeId, shopId });
        if (!foundedDiscount) throw new NotFoundError('Discount not existed');
        const result = await discountModel.findByIdAndUpdate(foundedDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_use: 1,
                discount_uses_count: -1,
            }
        })
        return result;
    }
}

module.exports = DiscountService;