import ProductDaoMongoDB from "../daos/mongodb/product.dao.js";
const productsDao = new ProductDaoMongoDB();

export const getByIdProduct = async (id) => {
  try {
    const item = await productsDao.getProductById(id);
    if (!item) throw new Error("Product not found!");
    else return item;
  } catch (error) {
    console.log(error);
  }
};

export const addProductToCart = async(cartId, productId) => {
  try {
    const exists = await productsDao.getProductById(productId);
    const newProduct = await productsDao.addProductToCart(cartId, productId);
    if(!exists) throw new Error('Product not found');
    return newProduct
  } catch (error) {
    console.log(error);
  }
}

export const createProduct = async (obj) => {
  try {
    const newProduct = await productsDao.createProduct(obj);
    if (!newProduct) throw new Error("Validation Error!");
    else return newProduct;
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (id, obj) => {
  try {
    let item = await productsDao.getProductById(id);
    if (!item) {
      throw new Error("Product not found!");
    } else {
      const productUpdated = await productsDao.updateProduct(id, obj);
      return productUpdated;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const productDeleted = await productsDao.deleteProduct(id);
    return productDeleted;
  } catch (error) {
    console.log(error);
  }
};
