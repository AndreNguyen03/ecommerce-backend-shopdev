'use strict'

import keytokenModel from "../models/keytoken.model.js";
import {isValidObjectId, Types} from 'mongoose';

class KeyTokenService {

    static async createKeyToken ({userId, publicKey, privateKey, refreshToken}) {
        try {
            // level 0
            /* const tokens = await keytokenModel.create({
                user: userId,
                publicKey,
                privateKey

            })
            return tokens ? tokens.publicKey : null; */

            // level xx
            const filter = {user: userId}, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = {upsert: true, new: true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null

        } catch (error) {
            return error;
        }
    }

    static async findByUserId (userId) {
        const _userId = new Types.ObjectId(userId);
        return await keytokenModel.findOne({user : _userId}).lean()
    }

    static async removeKeyById (id) {
        return await keytokenModel.deleteOne(id);
    }

    static async findByRefreshTokenUsed (refreshToken) {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }

    static async findByRefreshToken (refreshToken) {
        return await keytokenModel.findOne( {refreshToken});
    }

    static async deleteKeyById (userId) {
        return await keytokenModel.findOneAndDelete({user:userId});
    }

    static async  updateHolderToken(refreshToken, tokens) {
        try {
            // Tìm và cập nhật tài liệu
            const result = await keytokenModel.updateOne(
                { refreshToken: refreshToken },
                {
                    $set: { refreshToken: tokens.refreshToken },
                    $addToSet: { refreshTokensUsed: refreshToken }
                }
            );
    
            console.log('Update result:', result);
            
            // Kiểm tra tài liệu sau khi cập nhật
            const updatedToken = await keytokenModel.findOne({ refreshToken: tokens.refreshToken });
            console.log('Updated document:', updatedToken);
    
            return updatedToken;
        } catch (error) {
            console.error('Error updating holder token:', error);
        }
    }
}

export default KeyTokenService;