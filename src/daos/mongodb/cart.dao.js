import { ObjectId } from "mongodb";
import { CartModel } from "./models/cart.model.js";

export default class CartDaoMongoDB {
  async addProductToCart(cid, pid) {
    try {
      const cart = await CartModel.findOne({ _id: cid });
      if (cart.products.some((elemento) => elemento._id == pid)) {
        const indexProducto = cart.products.findIndex(
          (elemento) => elemento._id == pid
        );
        cart.products[indexProducto].quantity += 1;
      } else {
        cart.products.push(pid);
      }
      cart.save();
      return cart;
    } catch (error) {}
  }

  async getAll() {
    try {
      const carro = await CartModel.find({}).lean();
      return carro;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const response = await CartModel.findById(id).lean();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async create(obj) {
    try {
      const response = await CartModel.create(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCantidad(cid, pid, quantity) {
    try {
      console.log(cid, pid, quantity);
      let cart = await CartModel.findOne({ _id: cid });
      cart.products.forEach((element) => {
        if (element._id.valueOf() == pid) {
          element.quantity = quantity;
          cart.save();
        }
        return cart;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, obj) {
    try {
      const response = await CartModel.findByIdAndUpdate(id, obj, {
        new: true,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  Ob;
  async remove(cid, pid) {
    try {
      // const response = await CartModel.findByIdAndDelete(id);
      const cart = await CartModel.findById(cid);
      for (let index = 0; index < cart.products.length; index++) {
        const element = cart.products[index];
        if (element._id.valueOf() == pid) {
          cart.products.splice(index, 1);
          cart.save();
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async removeAll(cid) {
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) {
        return false;
      }
      for (let index = 0; index < cart.products.length; index++) {
        const element = cart.products[index];
        cart.products.splice(index, cart.products.length);
        cart.save();
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }
}


