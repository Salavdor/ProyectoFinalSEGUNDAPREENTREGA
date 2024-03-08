import { Router } from 'express';
import * as authJwt from '../middlewares/authJwt.js';
import passport from "passport";
import CartController from '../controllers/cart.controllers.js';
const controller = new CartController();

const router = Router();

router
        //Crear carrito
        .post("/",controller.createCart)

        //Obtener carrito por su ID
        .get("/:cid", controller.getCartById)

        //Agregar producto al carrito
        .post("/:pid", 
        passport.authenticate("jwtCookiesUser"), 
        controller.addProduct)

        //Eliminar producto del carrito
        .delete("/:pid", 
        passport.authenticate("jwtCookiesUser"),
        controller.deleteOneProduct)

        //Vaciar carrito
        .delete("/", 
        passport.authenticate("jwtCookiesUser"),
        controller.deleteAllProducts)

        //Finalizar compra (recibe el usuario por el req.user)
        .put("/purchase", 
        passport.authenticate("jwtCookiesUser"),
        controller.finalizePurchase)


export default router;