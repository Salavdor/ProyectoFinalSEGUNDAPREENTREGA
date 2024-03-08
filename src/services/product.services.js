import Services from "./class.services.js";
import factory from "../daos/factory.js";
const { prodDao } = factory;
import { generateProdFaker } from '../utils.js';

export default class ProductService extends Services {
  constructor() {
    super(prodDao);
  }

  async getProducts() {
    try {
      let result = await prodDao.getAll()
      return result
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductById(pid) {
    try {
      let result = await prodDao.getById(pid)
      return result
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // -----------------------------------------------------  //
  //                  REPOSITORY FUNCTION                   //
  // -----------------------------------------------------  //
  async createProduct(product) {
    try {
      let result = await prodDao.create(product)
      return result
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // -----------------------------------------------------  //
  

  async updateProduct(pid, productToReplace) {
    try {
      let result = await prodDao.update(pid, productToReplace)
      return result
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(pid) {
    try {
      let result = await prodDao.delete(pid)
      return result
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async paginateProducts(filter, options) {
    try {
      let result = await prodDao.paginate(filter, options)
      return result
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createProductMock(cant = 10) {
    try {
      const usersArray = [];
      for (let i = 0; i < cant; i++) {
        const product = generateProdFaker();
        usersArray.push(product);
      }
      const product = await prodDao.create(usersArray);
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
