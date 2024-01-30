import Services from "./class.services.js";
import UserDTO from "../dtos/user.dto.js";
import 'dotenv/config';
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
      // console.log('----> SERVICES Cart ' + cart)
      // console.log('----> SERVICES CartID ' + cart._id.valueOf())
      let userToInsert = new UserDTO(user)
      // console.log('----> SERVICES userToInsert ' + userToInsert, userToInsert)
      // agregamos el id del carrito a los datos de usuario
      const userCompilated = {...userToInsert, cartID: cart._id.valueOf()}
      console.log('----> SERVICES userCompilateds ' + userCompilated, userCompilated)
      const newUser = await userDao.register(userCompilated);
      console.log('----> SERVICES newUser ' + newUser)
      cart.user = newUser._id;
      cart.save();
      if(newUser){
          return newUser
      }else{
          return false
      }
    } catch (error) {
      console.log(error);
    }
  };

  async login(email, password) {
    try {
      const userExists = await userDao.login(email, password);
            if(userExists){
                return userExists
            }else{
                return false
            }
    } catch (error) {
      console.log(error);
    }
  };

  async getByEmail(email){
    try{
        return await userDao.getByEmail(email)
    }catch(error){
        throw new Error(error)
    }
}

async getById(id){
    try{
        return await userDao.getById(id)
    }catch(error){
        throw new Error(error)
    }
}

getUsers = async () => {
  let result = await userDao.getAll()
  return result
}

getUserById = async (uid) => {
  let result = await userDao.getById(uid)
  return result
}

getUserByEmail = async (email) => {
  let result = await userDao.getByEmail(email)
  return result
}

updateUser = async (uid, user) => {
  let result = await userDao.update(uid, user)
  return result
}



}
