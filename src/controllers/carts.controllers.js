import * as service from "../services/carts.services.js";

export const aggregation1 = async(req,res,next) =>{
  try {
    const { gender } = req.query;
    const response = await service.aggregation1(gender);
    res.json(response);
  } catch (error) {
    next(error)
  }
}

export const aggregation2 = async(req,res,next) =>{
  try {
    const response = await service.aggregation2();
    res.json(response);
  } catch (error) {
    next(error)
  }
}

export const updateManyAge = async(req,res,next) =>{
  try {
    const response = await service.updateManyAge();
    res.json(response);
  } catch (error) {
    next(error)
  }
}

export const createFileCtr = async (req, res, next) => {
  try {
    const newCarts = await service.createFileCart();
    if (!newCarts) throw new Error("Validation Error!");
    else res.json(newCarts);
  } catch (error) {
    next(error);
  }
};

export const getByNameCtr = async (req, res, next) => {
  try {
    const { name } = req.query;
    const item = await service.getByNameCart(name);
    if (!item) throw new Error("Cart not found!");
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const getByIdCtr = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await service.getByIdCart(id);
    if (!item) throw new Error("Cart not found!");

    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const getByEmailCtr = async (req, res, next) => {
  try {
    const { email } = req.params;
    const item = await service.getByEmailCart(email);
    if (!item) throw new Error("Cart not found!");
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const getAllCtr = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const response = await service.getAllCarts(page, limit);
    res.json(response);
    // const next = response.hasNextPage ? `http://localhost:8080/Carts/all?page=${response.nextPage}` : null;
    // const prev = response.hasPrevPage ? `http://localhost:8080/Carts/all?page=${response.prevPage}` : null;
    // res.json({
    //   payload: response.docs,
    //   info: {
    //     count: response.totalDocs,
    //     pages: response.totalPages,
    //     next,
    //     prev
    //   }
    // })
  } catch (error) {
    next(error);
  }
};

export const createCtr = async (req, res, next) => {
  try {
    const cart = { ...req.body };
    const newCart = await service.createCart(cart);
    if (!newCart) throw new Error("Validation Error!");
    else
      res.json({
        data: newCart,
      });
  } catch (error) {
    next(error);
  }
};

export const updateCtr = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    let item = await getByIdCart(id);

    if (!item) throw new Error("Cart not found!");

    const cartUpdated = await service.updateCart(id, {
      name,
      description,
      price,
      stock,
    });

    res.json({
      msg: "Cart updated",
      data: cartUpdated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCtr = async (req, res, next) => {
  try {
    const { id } = req.params;

    await service.deleteCart(id);

    res.json({
      msg: "Cart deleted",
    });
  } catch (error) {
    next(error);
  }
};
