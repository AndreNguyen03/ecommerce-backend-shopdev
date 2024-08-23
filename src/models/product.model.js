"use strict";
import { model, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thump: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

const furnitureSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    collection: "furnitures",
    timestamps: true,
  },
);
const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    collection: "clothes",
    timestamps: true,
  },
);
const electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    collection: "electronics",
    timestamps: true,
  },
);

//Export the model
export const product = model(DOCUMENT_NAME, productSchema);
export const furniture = model("Furniture", furnitureSchema);
export const clothing = model("Clothing", clothingSchema);
export const electronics = model("Electronic", electronicSchema);
