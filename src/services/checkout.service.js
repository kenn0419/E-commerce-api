'use strict'

const { findCartById, deleteItemFromCart } = require("../models/repositories/cart.repo");
const { BadRequestError } = require('../core/error.response');
const { checkProducts } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const orderModel = require("../models/order.model");

class CheckoutService {
    static async checkoutReview({ cartId, userId, shop_order_ids }) {
        const foundedCart = await findCartById({ cartId });
        if (!foundedCart) throw new BadRequestError('Cart not existed');
        const checkoutOrder = {
            totalPrice: 0,
            feeship: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shop_order_ids_new = [];
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];
            const checkProductServer = await checkProducts(item_products);
            if (!checkProductServer) throw new BadRequestError('Order went wrong');
            const checkoutPrice = checkProductServer.reduce((prev, prod) => prev + prod.price * prod.quantity, 0);
            checkoutOrder.totalPrice = checkoutPrice;
            const checkoutItem = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: 0,
                item_products: checkProductServer
            }
            if (shop_discounts.length > 0) {
                const { totalOrder, discount = 0, totalPrice = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer,
                })
                checkoutOrder.totalDiscount = discount;
                if (discount > 0) checkoutItem.priceApplyDiscount = checkoutPrice - discount;
            }
            checkoutOrder.totalCheckout += checkoutItem.priceApplyDiscount;
            shop_order_ids_new.push(checkoutItem);
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkoutOrder
        }
    }
    static async orderByUser({ shop_order_ids, cartId, userId, user_address = {}, user_payment = {} }) {
        const { shop_order_ids_new, checkoutOrder } = await this.checkoutReview({ cartId, userId, shop_order_ids });

        const products = shop_order_ids_new.flatMap(item => item.item_products);
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock({ productId, quantity, cartId });
            acquireLock.push(keyLock ? true : false);
            if (keyLock) {
                await releaseLock(keyLock);
            }
        }
        //check nếu có sản phẩm hết hàng trong kho
        if (acquireLock.includes(false)) {
            throw new BadRequestError('Some products has updated. Please go back to cart')
        }
        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkoutOrder,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        });
        if (newOrder) {
            //remove from cart
            // await deleteItemFromCart({userId, })
        }
        return newOrder;
    }
    static async getOrdersByUser() {

    }

    static async getOrderByUser() {

    }

    static async cancelOrderByUser() {

    }

    static async updateOrderStatusByAdmin() {

    }
}

module.exports = CheckoutService;