'use strict'

const { Types } = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey,
            // })
            // return tokens ? tokens.publicKey : null;
            const filter = { user: userId }, update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken }, options = { upsert: true, new: true };
            const token = await keyTokenModel.findOneAndUpdate(filter, update, options);
            return token ? token.publicKey : null;
        } catch (error) {
            return error;
        }
    }
    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    }
    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: new Types.ObjectId(id) });
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken });
    }
    static deleteKeyById = async (userId) => {
        return await keyTokenModel.deleteOne({ user: userId });
    }
}

module.exports = KeyTokenService;