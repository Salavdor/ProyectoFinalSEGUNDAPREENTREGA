import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';
const { jwt } = jsonwebtoken;
import { ExtractJwt, Strategy as jwtStrategy } from 'passport-jwt';
import factory from "../daos/factory.js";
const { userDao } = factory;
import 'dotenv/config';
import UserService from "../services/user.services.js";
const userService = new UserService();

const SECRET_KEY = process.env.SECRET_KEY_JWT;

const verifyToken = async(jwt_payload, done) => {;
  const user = await userDao.getById(jwt_payload.userId);
  if(!user){
    return done(null, false);
  }else{
    return done(null, jwt_payload)
  }
}

// Roles disponibles
const ROLES = ["user", "admin", "premium"]

// Validar que el usuario sea de role admin
export const isAdminOrPremium = async (req, res, next) => {
  const user = await userService.getUserByEmail(req.userEmail)

  if(user.role === "admin" || user.role === "premium") {
      next()
      return
  }

  return res.status(403).json({message:"Require Admin or Premium role"})
}

// Validar que el usuario sea de role user 
export const isUser = async (req, res, next) => {
  const user = await userService.getUserByEmail(req.userEmail)

  if(user.role === "user") {
      next()
      return
  }

  return res.status(403).json({message:"Require User role"})
}

/* ------------------------------------ - ----------------------------------- */

const strategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY,
}

passport.use('jwt', new jwtStrategy(strategyOptions, verifyToken));


/* ------------------------------------ - ----------------------------------- */

const cookieExtractor = (req)=>{
  const token = req.cookies.token
  return token
}
  
const strategyOptionsJwt = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: SECRET_KEY,
}  
  
  passport.use('jwtCookies', new jwtStrategy(strategyOptionsJwt, verifyToken,))
  passport.use('jwtCookiesUser', new jwtStrategy(strategyOptionsJwt, verifyToken, isUser))
  passport.use('jwtCookiesAdmin', new jwtStrategy(strategyOptionsJwt, verifyToken, isAdminOrPremium))

/* ------------------------------------ - ----------------------------------- */


//Serializar y deserializar.
passport.serializeUser((user, done)=>{
    done(null, user.userId);
});

passport.deserializeUser(async(id, done)=>{
    const user = await userDao.getById(id);
    return done(null, user);
});
