import { Schema, model } from 'mongoose';

export const cartSchema = new Schema({
    title: { type: String},
    products_list: [
      {
          product: {
              type: Schema.Types.ObjectId,
              ref: "Products"
          },
          quantity: { type: Number, default: 1 }
      }
  ] 
});

export const CartModel = model(
  'cart',
  cartSchema
);