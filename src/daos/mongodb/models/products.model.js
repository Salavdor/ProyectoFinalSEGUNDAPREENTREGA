import { Schema, model } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

export const productSchema = new Schema({
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

productSchema.plugin(mongoosePaginate);
export const ProductModel = model(
  'products',
  productSchema
);
