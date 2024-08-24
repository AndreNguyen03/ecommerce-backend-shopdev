`use strict`;
import express from "express";
import productController from "../../controllers/product.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../auth/authUtils.js";
const router = express.Router();

// search
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));
router.get('/', asyncHandler(productController.findAllProducts));
router.get('/:product_id', asyncHandler(productController.findProduct));

// authentication
router.use(authenticationV2);

// create product
router.patch("/:productId", asyncHandler(productController.updateProduct));
router.post("", asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

// QUERY //
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))

export default router;
