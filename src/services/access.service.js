"use strict";

import shopModel from "../models/shop.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import KeyTokenService from "../services/keyToken.service.js";
import { createTokenPair, verifyJWT } from "../auth/authUtils.js";
import { getInfoData } from "../utils/index.js";
import {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
} from "../core/error.response.js";
import { findByEmail } from "./shop.service.js";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static async signUp({ name, email, password }) {
    // step 1: check mail exists

    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
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
        privateKey,
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

  static async signIn({ email, password, refreshToken = null }) {
    /* 
  1 - check mail in dbs
  2 - match password
  3 - create AT vs RT and save
  4 - generate tokens
  5 - get data return login
  */
    // 1.
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered!");

    // 2.
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) return new AuthFailureError("Authentication error");

    // 3.
    // created privateKey,publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;
    // 4. gen tokens
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey,
    );

    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    // 5. return data
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  }

  static async signOut(keyStore) {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log(delKey);
    return delKey;
  }

  /* 
    check refreshtoken used
  */
  static async handlerRefreshToken(refreshToken) {
    // check token da dc su dung chua?
    const foundToken =
      await KeyTokenService.findByRefreshTokenUsed(refreshToken);

    console.log(`found token in used ::`, foundToken);

    if (foundToken) {
      // decode xem la ai?
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey,
      );
      console.log({ userId, email });

      // xoa tat ca token trong key store
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened !! Please relogin");
    }

    // neuu chua co , ok!
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("shop not registered! 1");

    // verifytoken
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey,
    );
    console.log(`[2]----`, { userId, email });

    // check UserId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered 2");

    // create 1 cap moi
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey,
    );

    // update token
    await KeyTokenService.updateHolderToken(refreshToken, tokens);
    return {
      user: { userId, email },
      tokens,
    };
  }

  static async handlerRefreshTokenV2({ keyStore, user, refreshToken }) {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened !! please relogin");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop not registered");

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered 2");

    // create 1 cap moi
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey,
    );

    // update token
    await KeyTokenService.updateHolderToken(refreshToken, tokens);
    return {
      user: { userId, email },
      tokens,
    };
  }
}

export default AccessService;
