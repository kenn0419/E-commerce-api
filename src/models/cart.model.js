'use strict'

const { Schema, Types, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';
// Declare the Schema of the Mongo model
var cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: {
        type: Array,
        required: true,
        default: [],
    },
    cart_count_product: {
        type: Number,
        default: 0,
    },
    cart_userId: {
        type: Number,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timeseries: {
        createdAt: 'createdOn',
        updatedAt: 'modifyOn'
    },
});

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);