import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collectionName = "products";

const collectionSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  thumbnails: { type: String, require: true },
  code: {
    type: String,
    unique: true,
    require: true,
  },
  stock: { type: Number, require: true },
  status: {
    type: Boolean,
    default: true,
  },
  category: { type: String, require: true },
});

collectionSchema.plugin(mongoosePaginate);
export const ProductModel = mongoose.model(collectionName, collectionSchema);
