`use strict`;
import express from "express";
import accessController from "../../controllers/access.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication } from "../../auth/authUtils.js";
const router = express.Router();

// signUp
router.post("/shop/signup", asyncHandler(accessController.signUp));

// signIn
router.post('/shop/signIn', asyncHandler(accessController.signIn));

// authentication
router.use(authentication);

// signOut
router.post('/shop/signOut',asyncHandler(accessController.signOut));

// handler refreshToken
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken));

export default router;
