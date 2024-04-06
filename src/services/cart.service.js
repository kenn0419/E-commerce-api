'use strict'

const { findUserCart, createUserCart, updateUserCartQuantity, deleteItemFromCart } = require("../models/repositories/cart.repo");
const { getProductById } = require("../models/repositories/product.repo");
const { NotFoundError } = require('../core/error.response');
const cartModel = require("../models/cart.model");

class CartService {
    static async addProductToCart({ userId, product = {} }) {
        const userCart = await findUserCart({ userId });
        console.log(userCart);
        if (!userCart) {
            return await createUserCart({ userId, product });
        } else if (userCart && userCart.cart_products.length === 0) {
            userCart.cart_products = [product];
            return await userCart.save();
        } else {
            return await updateUserCartQuantity({ userId, product });
        }
    }
    static async updateUserCart({ userId, shop_order_ids }) {
        const { quantity, productId, old_quantity, shopId } = shop_order_ids[0].item_products[0];
        const foundedProduct = await getProductById({ productId });
        if (!foundedProduct) throw new NotFoundError('Product not existed');
        if (!shopId === foundedProduct.product_shop) throw new NotFoundError('Product not belong to this shop');
        if (quantity === 0) {
            //delete product from cart
        }
        return await updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }
    static async deleteItemInCart({ userId, productId }) {
        const result = await deleteItemFromCart({ userId, productId });
        return result;
    }
    static async getListCart({ userId }) {
        return cartModel.findOne({ cart_userId: userId }).lean();
    }
}

module.exports = CartService;