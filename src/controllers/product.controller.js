"use strict";

import ProductServiceV2 from "../services/product.servicev2.js";
import { SuccessResponse } from "../core/success.response.js";

class ProductController {
  // v1 chi tuan thu factory design pattern
  /* async createProduct(req, res, next) {
    new SuccessResponse({
      message: "Create new Produc success!",
      metadata: await ProductService.createProduct(
        req.body.product_type,
        req.body,
      ),
    }).send(res); */

    // v2 tuan thu open/close + factory design pattern
    async createProduct(req, res, next) {
      new SuccessResponse({
        message: "Create new Produc success!",
        metadata: await ProductServiceV2.createProduct(
          req.body.product_type,
          {
            ...req.body,
            product_shop:req.user.userId,
          }),
      }).send(res);
  }
}

export default new ProductController();
