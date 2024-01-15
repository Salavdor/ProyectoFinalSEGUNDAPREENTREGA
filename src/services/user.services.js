import Services from "./class.services.js";


import 'dotenv/config';
import factory from "../daos/factory.js";
const { userDao } = factory;

export default class UserService extends Services {
  constructor() {
    super(userDao);
  }

  // #generateToken(user) {
  //   const payload = {
  //     userId: user.id,
  //   };
  //   return sign(payload, SECRET_KEY, { expiresIn: '10m' });
  // };

  async register(user) {
    try {
      const newUser = await userDao.register(user);
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
}
