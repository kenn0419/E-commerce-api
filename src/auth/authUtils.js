'use strict'

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtk-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2d'
        })
        //refreshToken
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7d'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                conosle.log('Error verify', err);
            } else {
                console.log('Decode verify', decode);
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {

    }
}

// const authentication = asyncHandler(async (req, res, next) => {
//     /* 
//         1- check userId missing?
//         2- get accesstoken
//         3- verify token
//         4- check user in db?
//         5- check keyStore with this userId  
//         6- Ok => next()
//     */
//     const userId = req.headers[HEADER.CLIENT_ID];
//     if (!userId) {
//         throw new AuthFailureError('Invalid Request');
//     }
//     const keyStore = await findByUserId(userId);
//     if (!keyStore) {
//         throw new NotFoundError('Not found keyStore');
//     }
//     const accessToken = req.headers[HEADER.AUTHORIZATION];
//     if (!accessToken) {
//         throw new AuthFailureError('Invalid Request');
//     }
//     try {
//         const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);
//         if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId');
//         req.keyStore = keyStore;
//         return next();
//     } catch (error) {
//         throw error;
//     }
// })

const authentication = asyncHandler(async (req, res, next) => {
    /* 
        1- check userId missing?
        2- get accesstoken
        3- verify token
        4- check user in db?
        5- check keyStore with this userId  
        6- Ok => next()
    */
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
        throw new AuthFailureError('Invalid Request');
    }
    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundError('Not found keyStore');
    }
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId');
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw error;
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
        throw new AuthFailureError('Invalid Request');
    }
    try {
        const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId');
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
}