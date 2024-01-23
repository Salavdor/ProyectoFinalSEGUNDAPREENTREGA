import Services from "./class.services.js";
import factory from "../daos/factory.js";
const { prodDao } = factory;
// Repository dependences //
import ProductDTO from "../dtos/product.dto.js";

export default class ProductService extends Services {
  constructor() {
    super(prodDao);
  }

  async getProducts() {
    try {
      let result = await prodDao.getAll()
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(pid) {
    try {
      let result = await prodDao.getById(pid)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  // -----------------------------------------------------  //
  //                  REPOSITORY FUNCTION                   //
  // -----------------------------------------------------  //
  async createProduct(product) {
    try {
      let productToInsert = new ProductDTO(product)
      let result = await prodDao.create(productToInsert)
      return result
    } catch (error) {
      console.log(error);
    }
  }
  // -----------------------------------------------------  //
  

  async updateProduct(pid, productToReplace) {
    try {
      let result = await prodDao.update(pid, productToReplace)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(pid) {
    try {
      let result = await prodDao.delete(pid)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async paginateProducts(filter, options) {
    try {
      let result = await prodDao.paginate(filter, options)
      return result
    } catch (error) {
      console.log(error);
    }
  }
}
