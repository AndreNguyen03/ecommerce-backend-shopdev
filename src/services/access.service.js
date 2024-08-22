"use strict";

import shopModel from "../models/shop.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import KeyTokenService from "../services/keyToken.service.js";
import { createTokenPair } from "../auth/authUtils.js";
import { getInfoData } from "../utils/index.js";
import { BadRequestError } from "../core/error.response.js";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static async signUp({ name, email, password }) {
    // try {
      // step 1: check mail exists
      
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestError('Error: Shop already registered!')
      }

      // hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // create new shop
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop["SHOP"]],
      });

      // if newShop return accesstoken, refreshtoken (JWT)
      if (newShop) {
        // create key

        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxxx",
            message: "publicKeyString error",
          };
        }

        // create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    // } catch (error) {
    //   return {
    //     code: "xxx",
    //     message: error.message,
    //   };
    // }
  }
}

export default AccessService;
