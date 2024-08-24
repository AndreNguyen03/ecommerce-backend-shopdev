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
          product_shop: req.user.userId,
        }),
    }).send(res);
  }

  async updateProduct(req, res, next) {
    new SuccessResponse({
      message: "Create new Produc success!",
      metadata: await ProductServiceV2.updateProduct(req.body.product_type,req.params.productId, {
          ...req.body,
          product_shop: req.user.userId
        }),
    }).send(res);
  }

  async publishProductByShop(req, res, next) {
    new SuccessResponse({
      message: 'Get publishProductByShop success',
      metadata: await ProductServiceV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res);
  }

  async unPublishProductByShop(req, res, next) {
    new SuccessResponse({
      message: 'unPublishProductByShop success',
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res);
  }
  

  // QUERY //
  /**
   * @description Get all Drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  async getAllDraftsForShop(req, res, next) {
    new SuccessResponse({
      message: 'Get list success',
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res);
  }

  async getAllPublishForShop(req, res, next) {
    new SuccessResponse({
      message: 'Get AllPublishForShop success',
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId
      })
    }).send(res);
  }

  async getListSearchProduct(req, res, next) {
    new SuccessResponse({
      message: 'get List search success',
      metadata: await ProductServiceV2.searchProducts(
        req.params
      )
    }).send(res);
  }

  async findAllProducts(req, res, next) {
    new SuccessResponse({
      message: 'get find all product success',
      metadata: await ProductServiceV2.findAllProducts(
        req.query
      )
    }).send(res);
  }

  async findProduct(req, res, next) {
    console.log(req.params.product_id);
    new SuccessResponse({
      message: 'get find all product success',
      metadata: await ProductServiceV2.findProduct(
        {product_id: req.params.product_id}
      )
    }).send(res);
  }
  // END QUERY //
}


export default new ProductController();
