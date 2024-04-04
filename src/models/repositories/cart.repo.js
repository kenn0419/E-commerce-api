const createUserCart = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: 'active' };
    const updateOrInsert = {
        $addToSet: {
            cart_product: product
        }
    }
    const options = { upset: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
}

const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
    };
    const updateSet = {
        $inc: {
            'cart_products.$.quantity': quantity
        }
    }
    const options = { upset: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateSet, options);
}


module.exports = {
    createUserCart,
    updateUserCartQuantity,
}