import Services from "./class.services.js";
import UserDTO from "../dtos/user.dto.js";
import "dotenv/config";
import factory from "../daos/factory.js";
const { userDao, cartDao } = factory;

export default class UserService extends Services {
  constructor() {
    super(userDao);
  }

  async register(user) {
    try {
      // crear carrito para asociar al usuario
      const cart = await cartDao.create();

      //traemos datos de usuario
      let userToInsert = new UserDTO(user);

      // agregamos el id del carrito a los datos de usuario
      const userCompilated = { ...userToInsert, cartID: cart._id.valueOf() };

      const newUser = await userDao.register(userCompilated);

      cart.user = newUser._id;
      cart.save();
      if (newUser) {
        return newUser;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(email, password) {
    try {
      const userExists = await userDao.login(email, password);
      if (userExists) {
        return userExists;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getByEmail(email) {
    try {
      return await userDao.getByEmail(email);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      return await userDao.getById(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUsers() {
    try {
      // return await userDao.getAll();
      let result = await userDao.getAllUsers();
      return result
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUser(uid, user) {
    try {
      return await userDao.update(uid, user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteById(id) {
    try {
      return await userDao.delete(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
