'use strict'

const { Schema, Types, model } = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

// Declare the Schema of the Mongo model
var cartSchema = new Schema({
    cart_state: {
        type: String,
        require: true,
        default: 'active',
        enum: ['active', 'complete', 'fail', 'pending']
    },
    cart_products: {
        type: Array,
        default: [],
        required: true,
        /**
         * Includes: 
         * {
            *  productId,
            *  shopId,
            *  quantity,
            *  name,
            *  price
         * }
         */
    },
    cart_count_products: {
        type: Number,
        required: true
    },
    cart_userId: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);