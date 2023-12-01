import * as service from "../services/products.services.js";

export const addProductToUser = async(req, res, next)=>{
  try {
    const { idUser } = req.params;
    const { idProduct } = req.params;
    const newProduct = await service.addProductToUser(idUser, idProduct);
    res.json(newProduct);
  } catch (error) {
    next(error);
  }
}


export const getByIdProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await service.getByIdProduct(id);
    if (!item) throw new Error("Product not found!");
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = { ...req.body };
    const newUser = await service.createProduct(product);
    if (!newUser) throw new Error("Validation Error!");
    else
      res.json({
        data: newUser,
      });
  } catch (error) {
    next(error);
  }
};
