'use strict'

import keytokenModel from "../models/keytoken.model.js";

class KeyTokenService {

    static async createKeyToken ({userId, publicKey, privateKey}) {
        try {
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey,
                privateKey

            })


            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }
}

export default KeyTokenService;