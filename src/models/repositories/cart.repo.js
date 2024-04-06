const cartModel = require("../cart.model");

const createUserCart = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: 'active' };
    const updateOrInsert = {
        $addToSet: {
            cart_products: product
        }
    }
    const options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
}

const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
    }, updateSet = {
        $inc: {
            'cart_products.$.quantity': quantity
        }
    }, options = { upset: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateSet, options);
}

const findUserCart = async ({ userId }) => {
    return await cartModel.findOne({ cart_userId: userId });
}

const deleteItemFromCart = async ({ userId, productId }) => {
    const query = { cart_userId: userId, cart_state: 'active' },
        updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        };
    return await cartModel.updateOne(query, updateSet);
}

module.exports = {
    createUserCart,
    findUserCart,
    updateUserCartQuantity,
    deleteItemFromCart,
}