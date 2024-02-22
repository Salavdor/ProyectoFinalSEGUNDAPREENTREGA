import { Router } from 'express';
import * as authJwt from '../middlewares/authJwt.js';
import passport from "passport";
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
      .post("/", passport.authenticate("jwtCookiesAdmin"), controller.createProducts)

      //Actualizar un producto
      .put("/:pid", passport.authenticate("jwtCookiesAdmin"), controller.updateProduct)

      //Eliminar producto por su ID.
      .delete("/:pid", passport.authenticate("jwtCookiesAdmin"), controller.deleteProduct)

      //creador de productos con faker.
      .post("/createproducts", controller.createProduct);


export default router;




