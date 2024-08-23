`use strict`;

import AccessService from "../services/access.service.js";
import { OK, CREATED, SuccessResponse } from "../core/success.response.js";

class AccessController {
  async signUp(req, res, next) {
    // return res.status(201).json(await AccessService.signUp(req.body));

    new CREATED({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  }

  async signIn(req, res, next) {
    new SuccessResponse({
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  }

  async signOut(req, res, next) {
    new SuccessResponse({
      message: "Logout success!",
      metadata: await AccessService.signOut(req.keyStore),
    }).send(res);
  }

  async handlerRefreshToken(req, res, next) {
    // v1
    /* new SuccessResponse({
      message: 'Get token success!',
      metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
    }).send(res); */

    // v2 no need accessToken
    new SuccessResponse({
      message: "Get token success!",
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  }
}

export default new AccessController();
