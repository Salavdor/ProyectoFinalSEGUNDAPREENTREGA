import Services from "./class.services.js";
import factory from "../daos/factory.js";
const { cartDao } = factory;
// Repository dependences //
import CartDTO from "../dtos/cart.dto.js";

export default class CartService extends Services {
  constructor() {
    super(cartDao);
  }

  async getCarts() {
    try {
      let result = await cartDao.get()
      return result
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCartById(cid) {
    try {
      let result = await cartDao.getById(cid)
      return result
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createCart(cart) {
    try {
        let cartToInsert = new CartDTO(cart)
        let result = await cartDao.create(cartToInsert)
        return result
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateCart(cid, cart) {
    try {
        let result = await cartDao.update(cid, cart)
        console.log('updateCart '+result)
        return result
    } catch (error) {
      throw new Error(error.message);
    }
  }

  
}
