import Controllers from "./class.controller.js";
import UserService from "../services/user.services.js";
import { createResponse } from "../utils.js";
const userService = new UserService();

import factory from "../daos/factory.js";
const { userDao } = factory;

export default class UserController extends Controllers {
  constructor() {
    super(userService);
  }

  register = async (req, res, next) => {
      try{
        res.redirect('/api/login');
    }catch(error){
        res.redirect('/api/error-register');
    }
  };

  login = async (req, res, next) => {
      try{
        res.cookie('token', req.user.access_token, {httpOnly: true}).redirect('/api/profile');
    }catch(error){
        res.redirect('/api/error-login');
    }
  };

  profile = (req, res, next) => {
    try {
      const { first_name, last_name, email, role } = req.user;
      createResponse(res, 200, {
        first_name,
        last_name,
        email,
        role,
      });
    } catch (error) {
      next(error.message);
    }
  };

  privateCookies = async(req, res) => {
    try {
      const { userId } = req.user;
      const user = await userService.getById(userId);
      // console.log(user)
      if (!user) res.send("Not found");
      else {
        const { first_name, last_name, email, role } = user;
        res.json({
          status: "success",
          userData: {
            first_name,
            last_name,
            email,
            role,
          },
        });
      }
    } catch (error) {
      next(error.message);
    }
  }


  githubResponse = async(req, res, next)=>{
    try {
        res.redirect('/api/profile');
    } catch (error) {
        res.redirect('/api/error-login');
    }
}

 currentUser = async(req, res, next)=>{
    try{
        console.log(req.user);
        res.redirect('/api/current');
    }catch(error){
        res.redirect('/api/profile');
    }
}
}


