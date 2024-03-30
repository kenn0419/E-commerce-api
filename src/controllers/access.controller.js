'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Register OK',
            metaData: await AccessService.signUp(req.body)
        }).send(res)
    }
    logIn = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login OK',
            metaData: await AccessService.logIn(req.body),
        }).send(res)
    }
    logOut = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout OK',
            metaData: await AccessService.logOut(req.keyStore),
        }).send(res)
    }
}

module.exports = new AccessController();