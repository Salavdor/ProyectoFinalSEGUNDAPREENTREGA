import { Schema, model } from 'mongoose';

export const cartSchema = new Schema({
    products_list: [
      {
        _id: false,
          product: {
              type: Schema.Types.ObjectId,
              ref: "products" // Referencia al modelo de productos
          },
          quantity: { type: Number, default: 1 }
      }
  ] 
});

export const CartModel = model(
  'cart',
  cartSchema
);