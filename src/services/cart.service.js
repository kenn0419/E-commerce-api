'use strict'

const cartModel = require("../models/cart.model");
const { createUserCart, updateUserCartQuantity } = require("../models/repositories/cart.repo");

/**
 * Key features: Cart service
 * - add product to cart [user]
 * - reduce product quantity [user]
 * - increase product quantity [user]
 * - get list to cart [user]
 * - delete cart [user]
 * - delete cart item [user]
 */

class CartService {
    static async addTocart({ userId, product = {} }) {
        //check cart exist?
        const userCart = await cartModel.findOne({ cart_userId: userId });
        if (!userCart) {
            return await createUserCart({ userId, product });
        }
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save();
        }
        return await updateUserCartQuantity({ userId, product });
    }
}

module.exports = CartService;