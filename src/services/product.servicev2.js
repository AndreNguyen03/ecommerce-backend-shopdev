"use strict";
import {
  product,
  clothing,
  electronics,
  furniture,
} from "../models/product.model.js";
import { BadRequestError, ForbiddenError } from "../core/error.response.js";
import { findAllDraftsForShop, publishProductByShop,unPublishProductByShop, findAllPublishForShop, searchProductByUser, findAllProducts, findProduct, updateProductById } from "../models/repositories/product.repo.js";
import {removeNullAndUndefined,updateNestedObjectParser} from '../utils/index.js'

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

  static async updateProduct(type,productId,payload) {
    const productClass = ProductFactory.productRegistry[type];
    if(!productClass) throw new BadRequestError(`Invalid Product Type: ${type}`);
    
    return new productClass(payload).updateProduct(productId)
  }

  // PUT //
  static async publishProductByShop({product_shop, product_id}) {
    return await publishProductByShop({product_shop,product_id});
  }

  static async unPublishProductByShop({product_shop, product_id}) {
    return await unPublishProductByShop({product_shop,product_id});
  }
  // END PUT //


  // query //
  static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}) {
    const query = {product_shop, isDraft: true};
    return await findAllDraftsForShop({query,limit,skip})
  }

  static async findAllPublishForShop({product_shop, limit = 50, skip = 0}) {
    const query = {product_shop, isPublished: true};
    return await findAllPublishForShop({query,limit,skip})
  }

  static async searchProducts({keySearch}) {
    return await searchProductByUser({keySearch});
  }

  static async findAllProducts({limit =50,sort = 'ctime', page = 1, filter = {isPublished: true}}){
    return await findAllProducts({limit,sort,filter,page,
      select: ['product_name','product_price', 'product_thump']
    });
  }

  static async findProduct({product_id}){
    console.log(product_id)
    return await findProduct({product_id, unSelect: ['__v']});
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

  // update product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({productId, bodyUpdate, model: product})
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

  async updateProduct(productId) {
    
    // 1. remove attr has null , undefined
    // 2. check xem update o cho nao? 
    const objectParams = removeNullAndUndefined(this);
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),model:furniture})
    }

    const updateProduct = await super.updateProduct(productId,objectParams);
    return updateProduct;
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

  async updateProduct(productId) {
    
    // 1. remove attr has null , undefined
    // 2. check xem update o cho nao?
    const objectParams = this;
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({productId, objectParams,model:clothing})
    }

    const updateProduct = await super.updateProduct(productId,objectParams);
    return updateProduct;
  }
}

// Register product types
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);


export default ProductFactory;
