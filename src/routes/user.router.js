import { Router } from 'express';
// import { checkAuth } from '../middlewares/authJwt.js';
import passport from "passport";
import UserController from '../controllers/user.controllers.js';
const controller = new UserController();

const router = Router();

router
        .post('/register', controller.register)
        .post('/login', controller.login)
        // .get('/profile', checkAuth, controller.profile)

        // .get("/private-cookies", passport.authenticate("jwtCookies"), controller.privateCookies)

        .get('/current', passport.authenticate("jwtCookies"), controller.currentUser)

export default router;

