import MongoDao from "./mongo.dao.js";
import { CartModel } from "./models/cart.model.js";

export default class CartDaoMongo extends MongoDao {
    constructor() {
        super(CartModel);
    }

    async get(){
        try {
            let cart = await CartModel.find().populate('products_list.product')
            return cart
        } catch (error) {
          console.log(error)
          throw new Error(error.message);
        }
      }

      async getById(cid){
        try {
            let result = await CartModel.findOne({_id: cid}).populate('products_list.product')
            return result
        } catch (error) {
          console.log(error)
          throw new Error(error.message);
        }
      }

};