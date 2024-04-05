'use strict'
const { BadRequestError, NotFoundError } = require('../core/error.response');
const discountModel = require('../models/discount.model');
const { findDiscount, findAllDiscountCodesUnSelect, updateDiscount } = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectMongoDb } = require('../utils');


class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to,
            name, description, type, value, max_value,
            max_use, uses_count, max_uses_per_user
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
    static async getProductsWithDiscountCode({ code, shopId, userId, limit, page }) {
        const foundedDiscount = await findDiscount({ code, shopId });
        if (!foundedDiscount || !foundedDiscount.is_active) {
            throw new NotFoundError('Discount not existed');
        }
        const { discount_applies_to, discount_product_ids } = foundedDiscount;
        let products;
        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPubLished: true,
                },
                limit: +limit,
                page,
                sort: 'ctime',
                select: ['product_name']
            })
            return products;
        } else {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPubLished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
            return products;
        }
    }

    static async getProductsWithShopId({ limit, page, shopId, }) {
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
}