"use strict";
import { model, Schema, Types } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = new Schema(
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
    product_slug: {
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
      ref: "Shop",
      required: true,
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    // more
    product_ratingsAvg: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      // round 4.34433
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// create index for search 
productSchema.index({product_name: 'text', product_description: 'text'});

// Document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, {lower :true});
  next();
})

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
