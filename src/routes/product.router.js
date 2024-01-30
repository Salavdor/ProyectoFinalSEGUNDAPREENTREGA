import { Router } from 'express';
import * as authJwt from '../middlewares/authJwt.js';
import ProductController from '../controllers/product.controllers.js';
const controller = new ProductController();

const router = Router();

router 
      .get("/?filter", controller.aggregation1)
      //Obtener lista de productos
      .get("/", controller.getProducts)

      //Obtener producto por ID
      .get("/:pid", controller.getProductById)

      //Agregar productos
      .post("/", authJwt.verifyToken, authJwt.isAdminOrPremium, controller.createProducts)

      //Actualizar un producto
      .put("/:pid", authJwt.verifyToken, authJwt.isAdminOrPremium, controller.updateProduct)

      //Eliminar producto por su ID.
      .delete("/:pid", authJwt.verifyToken, authJwt.isAdminOrPremium, controller.deleteProduct)


export default router;




