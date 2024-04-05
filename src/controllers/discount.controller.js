'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create discount successfully',
            statusCode: 200,
            metaData: await DiscountService.createDiscountCode({ ...req.body, shopId: req.user.userId })
        }).send(res)
    }
    getAllDiscountCodeWithShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all discounts successfully',
            statusCode: 200,
            metaData: await DiscountService.getDiscountsWithShopId({ ...req.query, shopId: req.user.userId })
        }).send(res)
    }
    getAllProductsWithDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all products successfully',
            statusCode: 200,
            metaData: await DiscountService.getProductsWithDiscountCode({ ...req.query })
        }).send(res)
    }
    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get discount amount successfully',
            statusCode: 200,
            metaData: await DiscountService.getDiscountAmount({ ...req.body })
        }).send(res)
    }
}

module.exports = new DiscountController();