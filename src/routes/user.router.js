import { Router } from "express";
import * as UserController from "../controllers/user.controllers.js";


const router = Router();


router.get("/", UserController.loginForm);
router.get("/register", UserController.registerForm);
router.get("/profile", UserController.profile);
router.get("/register-error", UserController.registerError);


router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);

export default router;
