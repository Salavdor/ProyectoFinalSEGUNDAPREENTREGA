import MongoDao from "./mongo.dao.js";
import { UserModel } from "./models/user.model.js";
import { createHash, isValidPassword } from "../../utils.js";

export default class UserDaoMongo extends MongoDao {
    constructor() {
        super(UserModel);
    }

    async register(user) {
        try {
            const { email, password} = user;
            console.log('======> DAO User ' + user, user)
            const userExist = await this.getByEmail(email); 
            if(!userExist){
              if(email === 'adminCoder@coder.com' && password === 'adminCoder123'){
                return await this.model.create({
                    ...user,
                    password: createHash(password),
                    role: 'admin',
                });
            }
            return await this.model.create({
                ...user,
                password: createHash(password)
            });
            
            } else {
              return false;
            }
            
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async login(email, password) {
        try {   
            const userExist = await this.getByEmail(email); 
            // console.log('dao', userExist);
            if (userExist){
              const isValid = isValidPassword(userExist, password);
              if(isValid){
                  return userExist
              }else{
                  return false
              }
            }else{
                return false;
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async getByEmail(email) {
        try {
            // const user = await this.model.findOne({ email });
            // if(user) return user;
            // else return false;

            const response = await this.model.findOne({email}); 
            if(response){
                return response
            }else{
                return false
            }
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    };

    async getById(id){
        try {
          const user = await this.model.findById(id)
            if(user){
                return user
            }else{
                return false
            }
        } catch (error) {
          console.log(error)
          throw new Error(error)
        }
      }

      async getById(id){
        try {
          const user = await this.model.findById(id)
            if(user){
                return user
            }else{
                return false
            }
        } catch (error) {
          console.log(error)
          throw new Error(error)
        }
      }

  
};