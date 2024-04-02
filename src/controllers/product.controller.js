'use strict'

const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service");


class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create product successfully',
            metaData: await ProductFactory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Published product successfully',
            metaData: await ProductFactory.publicProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            }),
        }).send(res)
    }
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublished product successfully',
            metaData: await ProductFactory.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            }),
        }).send(res)
    }

    // QUERY
    /**
     * @desc Get all Draft for shop
     * @param {Number} limit 
     * @param {Number} skip 
     * @return {JSON}
     */
    getAllDraftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list draft successfully',
            metaData: await ProductFactory.findAllDraftForShop({
                product_shop: req.user.userId,

            }),
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list publish successfully',
            metaData: await ProductFactory.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search products successfully',
            metaData: await ProductFactory.searchProducts(req.params),
        }).send(res)
    }
}

module.exports = new ProductController();