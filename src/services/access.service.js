'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

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
        // } catch (error) {
        //     return {
        //         code: 'xxx',
        //         status: 'error',
        //         message: error.message,
        //     }
        // }
    }
}

module.exports = AccessService;