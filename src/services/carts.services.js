import CartDaoMongoDB from "../daos/mongodb/carts.dao.js";
const cartDao = new CartDaoMongoDB();
import fs from "fs";
import { __dirname } from "../utils.js";

const cartsFile = JSON.parse(
  fs.readFileSync(__dirname + "/data/Carts.json", "utf-8")
);

export const aggregation1 = async(gender) =>{
  try {
    return await cartDao.aggregation1(gender);
  } catch (error) {
    console.log(error);
  }
}


export const aggregation2 = async() =>{
  try {
    return await cartDao.aggregation2();
  } catch (error) {
    console.log(error);
  }
}

export const updateManyAge = async() => {
  try {
    return await cartDao.updateManyAge();
  } catch (error) {
    console.log(error);
  }
}

export const createFileCart = async () => {
  try {
    const newCart = await cartDao.createCart(cartsFile);
    if (!newCart) return false;
    return { message: "¡Carts saved successfully!" };
  } catch (error) {
    console.log(error);
  }
};


export const getByNameCart = async (name) => {
  try {
    const item = await cartDao.getCartByName(name);
    if (!item) return false;
    else return item;
  } catch (error) {
    console.log(error);
  }
};

export const getByIdCart = async (id) => {
  try {
    const item = await cartDao.getCartById(id);
    if (!item) return false;
    else return item;
  } catch (error) {
    console.log(error);
  }
};

export const getByEmailCart = async (email) => {
  try {
    const item = await cartDao.getCartByEmail(email);
    if (!item) return false;
    else return item;
  } catch (error) {
    console.log(error);
  }
};

export const getAllCarts = async (page, limit) => {
  try {
    const item = await cartDao.getAllCarts(page, limit);
    if (!item) throw new Error("Cart not found!");
    else return item;
  } catch (error) {
    console.log(error);
  }
};

export const createCart = async (obj) => {
  try {
    const newCart = await cartDao.createCart(obj);
    if (!newCart) throw new Error("Validation Error!");
    else return newCart;
  } catch (error) {
    console.log(error);
  }
};

export const updateCart = async (id, obj) => {
  try {
    let item = await cartDao.getCartById(id);
    if (!item) {
      throw new Error("Cart not found!");
    } else {
      const cartUpdated = await cartDao.updateCart(id, obj);
      return cartUpdated;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteCart = async (id) => {
  try {
    const cartDeleted = await cartDao.deleteCart(id);
    return cartDeleted;
  } catch (error) {
    console.log(error);
  }
};
