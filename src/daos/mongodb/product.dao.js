import { ProductModel } from "./models/product.model.js";
import { CartModel } from "./models/product.model.js";

export default class ProductDaoMongoDB {

  async addProductToCart(cartId, productId){
    try {
      const cart = await CartModel.findById(cartId);
      cart.products.push(productId);
      cart.save();
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const response = await ProductModel.findById(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllProducts() {
    try {
      const response = await ProductModel.find({});
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async createProduct(obj) {
    try {
      const response = await ProductModel.create(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, obj) {
    try {
      await ProductModel.updateOne({ _id: id }, obj);
      return obj;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const response = await ProductModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
