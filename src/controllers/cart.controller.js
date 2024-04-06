'use strict'

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add to cart successfully',
            statusCode: 200,
            metaData: await CartService.addProductToCart(req.body)
        }).send(res)
    }
    updateQuantiTy = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update quantity successfully',
            statusCode: 200,
            metaData: await CartService.updateUserCart(req.body)
        }).send(res)
    }
    deleteItemInCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete item from cart successfully',
            statusCode: 200,
            metaData: await CartService.deleteItemInCart(req.body)
        }).send(res)
    }
    getListCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list cart successfully',
            statusCode: 200,
            metaData: await CartService.getListCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController();