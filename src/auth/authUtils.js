"use strict";

import JWT from "jsonwebtoken";

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
    JWT.verify(accessToken, publicKey, (error, decoded) =>{
      if(error){
        console.error('Error verifying token:', err);
      } else {
        console.log('Decoded token:', decoded);
      }
    } )

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

export { createTokenPair };
