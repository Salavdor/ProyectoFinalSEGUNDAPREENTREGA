import { getRandomNumber } from "../../utils.js";
import { CartModel } from "./models/cart.model.js";

export default class CartDaoMongoDB {
  async aggregation1(gender) {
    try {
      return await CartModel.aggregate([
        {
          $match: {
            gender: gender,
            age: { $gte: 18 },
          },
        },
        {
          $sort: {
            age: 1,
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  async aggregation2() {
    try {
      return await CartModel.aggregate([
        {
          $match: {
            age: { $gte: 18 }
          }
        },
        {
          $group: {
            _id: '$gender',
            average_age: { $avg: '$age' },
            count: { $sum: 1 },
            youngest: { $min: '$age' }, //edad del mas joven
            oldest: { $max: '$age' }
          }
        },
        {
          $sort: {
            average_age: 1
          }
        }
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  async updateManyAge() {
    try {
      const carts = await this.getAllCarts();
      for (const cart of carts) {
        cart.age = getRandomNumber();
        cart.save();
      }
      return { mesg: "Update carts OK" };
    } catch (error) {
      console.log(error);
    }
  }

  async getCartByName(name) {
    try {
      const response = await CartModel.find({ first_name: name }).explain();
      return response.executionStats;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartByEmail(email) {
    try {
      const response = await CartModel.find({ email: email }).explain();
      return response.executionStats;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const response = await CartModel.findById(id).populate("pets");
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllCarts(page = 1, limit = 10) {
    try {
      const response = await CartModel.paginate({}, { page, limit });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async createCart(obj) {
    try {
      const response = await CartModel.create(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCart(id, obj) {
    try {
      await CartModel.updateOne({ _id: id }, obj);
      return obj;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCart(id) {
    try {
      const response = await CartModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
