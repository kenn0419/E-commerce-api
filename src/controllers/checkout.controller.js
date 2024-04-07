'use strict'

const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class checkoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Review checkout',
            statusCode: 200,
            metaData: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}

module.exports = new checkoutController();