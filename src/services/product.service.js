"use strict";
import { product, clothing, electronics } from "../models/product.model.js";
import { BadRequestError, ForbiddenError } from "../core/error.response.js";

// define Factory class to create product
class ProductFactory {
  /* example:
        type: 'Clothing',
        payload
    */
  static async createProduct() {}
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
  }

  // create new product
  async createProduct() {
    return await product.create(this);
  }
}

// define sub-class for different product type Clothing
class Electronics extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("Create new clothing error!");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product error");
  }
}

class Furniture extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("Create new clothing error!");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product error");
  }
}

class Clothing extends Producpt {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("Create new clothing error!");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product error");
  }
}

export default ProductFactory;
