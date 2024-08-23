`use strict`;
import express from "express";
import accessRouter from "./access/index.js";
import productRouter from "./product/index.js";
import { apiKey, permission } from "../auth/checkAuth.js";
const router = express.Router();

//check apikey
router.use(apiKey);
//check permission
router.use(permission(`0000`));

router.use("/v1/api", accessRouter);
router.use("/v1/api/product", productRouter);

export default router;
