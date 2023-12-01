import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true,
  //   index: true,
  // },
  title: {
    type: String,
    required: true,
    index: true,
  },
  description: String,
  price: Number,
  thumbnails: String,
  code: {
    type: String,
    unique: true,
  },
  stock: Number,
  category: String,
  status: {
    type: Boolean,
    default: true,
  }
});

export const ProductModel = mongoose.model("product", ProductSchema);
