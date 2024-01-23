import Services from "./class.services.js";
import factory from "../daos/factory.js";
const { prodDao } = factory;
// Repository dependences //
import CartDTO from "../dtos/cart.dto.js";

export default class CartService extends Services {
  constructor() {
    super(prodDao);
  }

  async getCart() {
    try {
      let result = await prodDao.get()
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(cid) {
    try {
      let result = await prodDao.getById(cid)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async createCart(cart) {
    try {
        let cartToInsert = new CartDTO(cart)
        let result = await prodDao.create(cartToInsert)
        return result
    } catch (error) {
      console.log(error);
    }
  }

  async updateCart(cid, cart) {
    try {
        let result = await prodDao.update(cid, cart)
        return result
    } catch (error) {
      console.log(error);
    }
  }

  
}
