import { Router } from 'express';
import * as authJwt from '../middlewares/authJwt.js';
import passport from "passport";
import CartController from '../controllers/cart.controllers.js';
const controller = new CartController();

const router = Router();

router
        //Crear carrito
        .post("/",controller.createCart)

        //Obtener carrito
        .get("/", controller.getCart)

        //Obtener carrito por su ID
        .get("/:cid", controller.getCartById)

        //Agregar producto al carrito
        .post("/:cid/:pid", authJwt.verifyToken, authJwt.isUser, controller.addProduct)

        //Eliminar producto del carrito
        .delete("/:cid/:pid", authJwt.verifyToken, authJwt.isUser, controller.deleteOneProduct)

        //Vaciar carrito
        .delete("/:cid", authJwt.verifyToken, authJwt.isUser, controller.deleteAllProducts)

        //Finalizar compra (Tiene que recibir el id del usuario por el body)
        .put("/:cid/purchase", authJwt.verifyToken, authJwt.isUser, controller.finalizePurchase)


export default router;