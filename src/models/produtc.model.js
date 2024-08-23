'use strict'
import {model, Schema, Types} from 'mongoose';

const DOCUMENT_NAME='Product';
const COLLECTION_NAME='Products';

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name:{
        type:String,
        required:true,
    },
    product_thump:{
        type:String,
        required:true,
    },
    product_description:{
        type:String,
    },
    product_price:{
        type:Number,
        required:true,
    },
    product_quantity:{
        type:Number,
        required:true,
    },
    product_type: {
        type:String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
        type:String
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
});

const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true,
        trim: true
    },
    size: {
        type:String
    },
    material: {
        type:String
    }
},{
    collection: 'furnitures',
    timestamps:true
})
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true,
        trim: true
    },
    size: {
        type:String
    },
    material: {
        type:String
    }
},{
    collection: 'clothes',
    timestamps:true
})
const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type:String
    },
    color: {
        type:String
    }
},{
    collection: 'electronics',
    timestamps:true
})

//Export the model
export const Product = model(DOCUMENT_NAME, productSchema);
export const Furniture = model('Furniture', furnitureSchema);
export const Clothing = model('Clothing', clothingSchema);
export const Electronics = model('Electronic', electronicSchema);