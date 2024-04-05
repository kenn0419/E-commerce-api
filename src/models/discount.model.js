'use strict'

const { Schema, Types, model } = require('mongoose');
const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';
// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name: {
        type: String,
        require: true,
    },
    discount_description: {
        type: String,
        required: true,
    },
    discount_type: { //percentage
        type: String,
        default: 'fixed_amount'
    },
    discount_value: { //10%, 20%...
        type: Number,
        required: true
    },
    discount_code: { // discountCode
        type: String,
        required: true,
    },
    discount_start_date: { // Date start
        type: Date,
        required: true,
    },
    discount_end_date: { //Date expired
        type: Date,
        required: true,
    },
    discount_max_use: { //Max quantity
        type: Number,
        required: true
    },
    discount_uses_count: { // Users's used quantity
        type: Number,
        required: true,
    },
    discount_users_used: { // list user used
        type: Array,
        default: []
    },
    discount_max_uses_per_user: { // Max discount quantity is used for a user
        type: Number,
        required: true
    },
    discount_min_order_value: { //Minimum order value
        type: Number,
        required: true
    },
    discount_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    discount_is_active: {
        type: Boolean,
        required: true
    },
    discount_applies_to: { //apply to which products
        type: String,
        required: true,
        enum: ['all', 'specific']
    },
    discount_product_ids: { //list product is applied to discount
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);