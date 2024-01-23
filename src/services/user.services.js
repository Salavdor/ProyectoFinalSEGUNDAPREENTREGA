import Services from "./class.services.js";
import UserDTO from "../dtos/user.dto.js";
import 'dotenv/config';
import factory from "../daos/factory.js";
const { userDao } = factory;

export default class UserService extends Services {
  constructor() {
    super(userDao);
  }

  async register(user) {
    try {
      console.log('----> SERVICES user' + user.email)
      let userToInsert = new UserDTO(user)
      const newUser = await userDao.register(userToInsert);
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
