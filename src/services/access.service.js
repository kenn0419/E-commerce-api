'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { findByEmail } = require("./shop.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbidenError } = require("../core/error.response");
const keyTokenModel = require("../models/keyToken.model");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        //step 1: check email existed
        const holderShop = await shopModel.findOne({ email }).lean(); //lean sẽ giảm thiểu kích thức object trả về
        if (holderShop) {
            throw new BadRequestError('Error: Shop already existed')
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP]
        })
        if (newShop) {
            //create privateKey, publicKey
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            console.log({ privateKey, publicKey });
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                throw new BadRequestError('PublicKeyString is error')
            }
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
            console.log('Created token success:', tokens);
            return {
                code: 201,
                metaData: {
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metaData: null
        }
    }
    static logIn = async ({ email, password, refreshToken = null }) => {
        /* 
            1- check email
            2- check password
            3- create accesstoken and refreshtoken
            4 - generate token
            5- get data return login
        */
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Shop not existed')
        }
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new AuthFailureError('Authentication error')
        }
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey);
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        })
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }
    static logOut = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log({ delKey });
        return delKey;
    }
    // static handleRefreshToken = async (refreshToken) => {
    //     //check refreshtoken used
    //     const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    //     if (foundToken) {
    //         //decode xem thử là user hay hacker
    //         const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
    //         console.log({ userId, email });
    //         //xoa tat ca token trong keystore
    //         await KeyTokenService.deleteKeyById(userId);
    //         throw new ForbidenError('Something went wrong. Please relogin');
    //     }
    //     const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    //     if (!holderToken) throw new AuthFailureError('Shop not existed');
    //     const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
    //     //check userId
    //     const foundShop = await findByEmail({ email });
    //     if (!foundShop) throw new AuthFailureError('Shop not existed');
    //     const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);
    //     //update token
    //     await holderToken.updateOne({
    //         $set: {
    //             refreshToken: tokens.refreshToken,
    //         },
    //         $addToSet: {
    //             refreshTokensUsed: refreshToken // đã sử dụng
    //         }
    //     })
    //     return {
    //         user: { userId, email },
    //         tokens
    //     }
    // }
    static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user;
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbidenError('Something went wrong. Please relogin');
        }
        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not existed');
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError('Shop not existed');
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);
        //update token
        await keyTokenModel.updateOne({ user: userId }, {
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // đã sử dụng
            }
        })
        return {
            user,
            tokens
        }
    }
}

module.exports = AccessService;