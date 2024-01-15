import passport from 'passport';
import { ExtractJwt, Strategy as jwtStrategy } from 'passport-jwt';
import factory from "../daos/factory.js";
const { userDao } = factory;
import 'dotenv/config';

const SECRET_KEY = process.env.SECRET_KEY_JWT;

const verifyToken = async(jwt_payload, done) => {
  // console.log('payload', jwt_payload);
  const user = await userDao.getById(jwt_payload.userId);
  if(!user){
    return done(null, false);
  }else{
    return done(null, jwt_payload)
  }
}

const strategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY,
}

passport.use('jwt', new jwtStrategy(strategyOptions, verifyToken));


/* ------------------------------------ - ----------------------------------- */

const cookieExtractor = (req)=>{
  const token = req.cookies.token
  console.log('cookie--->', token)
  return token
}
  
const strategyOptionsCookies = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: SECRET_KEY,
}  
  
  passport.use('jwtCookies', new jwtStrategy(strategyOptionsCookies, verifyToken))

/* ------------------------------------ - ----------------------------------- */
  
passport.serializeUser((user, done)=>{
    // console.log('user', user);
    done(null, user.userId);
});

passport.deserializeUser(async(id, done)=>{
    const user = await userDao.getById(id);
    return done(null, user);
});
