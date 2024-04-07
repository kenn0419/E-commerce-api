'use strict'

const { Schema, Types, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';
// Declare the Schema of the Mongo model
var orderSchema = new Schema({
    order_userId: {
        type: Number,
        required: true
    },
    /**
     * order_checkout: {
     *      totalPrice,
     *      totalApplyDiscount,
     *      feeShip
     * }
     */
    order_checkout: {
        type: Object,
        default: {}
    },
    /**
     * street,
     * city,
     * state,
     * country
     */
    order_shipping: {
        type: Object,
        default: {}
    },
    order_payment: {
        type: Object,
        default: {}
    },
    order_products: {
        type: Array,
        required: true
    },
    order_trackingNumber: {
        type: String,
        default: '#00104072024'
    },
    order_status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);