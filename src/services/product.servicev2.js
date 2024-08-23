"use strict";
import {
  product,
  clothing,
  electronics,
  furniture,
} from "../models/product.model.js";
import { BadRequestError, ForbiddenError } from "../core/error.response.js";

// define Factory class to create product
class ProductFactory {
  /* example:
        type: 'Clothing',
        payload
  */  
  static productRegistry = {} // key-class

  static registerProductType (type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type,payload) {
    const productClass = ProductFactory.productRegistry[type];
    if(!productClass) throw new BadRequestError(`Invalid Product Type: ${type}`);
    
    return new productClass(payload).createProduct()
  }
}

class Product {
  constructor({
    product_name,
    product_thump,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
  }) {
    this.product_name = product_name;
    this.product_thump = product_thump;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
  }

  // create new product
  async createProduct(productId) {
    return await product.create({...this,_id: productId});
  }
}

// define sub-class for different product type Clothing
class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newElectronics)
      throw new BadRequestError("Create new clothing error!");

    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) throw new BadRequestError("Create new product error");
    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newFurniture) throw new BadRequestError("Create new clothing error!");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create new product error");
    return newProduct;
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newClothing) throw new BadRequestError("Create new clothing error!");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new product error");
    return newProduct;
  }
}

// Register product types
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);


export default ProductFactory;
