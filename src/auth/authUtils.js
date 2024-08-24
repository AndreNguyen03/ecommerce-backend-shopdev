"use strict";

import JWT from "jsonwebtoken";
import { asyncHandler } from "../helpers/asyncHandler.js";
import { AuthFailureError, NotFoundEror } from "../core/error.response.js";
import KeyTokenService from "../services/keyToken.service.js";

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rfresh-token",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // create accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    //
    JWT.verify(accessToken, publicKey, (error, decoded) => {
      if (error) {
        console.error("Error verifying token:", err);
      } else {
        console.log("Decoded token:", decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /* 
    1 - check userId missing ???
    2 - get accessToken 
    3 - verify token
    4 - check user in dbs?
    5 - check keyStore with this userId?
    6 - OK all => return next
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  // 2.
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundEror("Not found keyStore");

  // 3.
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid Userid");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  // 1.
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  // 2.
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundEror("Not found keyStore");

  // 3. kiem tra xem co refreshtoken 
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid Userid");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  // 4.
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");
    try {
      const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid Userid");
      req.keyStore = keyStore;
      req.user = decodeUser;
      return next();
    } catch (error) {
      throw error;
    }
    
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

export { createTokenPair, authentication, verifyJWT, authenticationV2 };
