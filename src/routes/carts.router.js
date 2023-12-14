import { Router } from "express";
import * as controller from "../controllers/cart.controller.js";

const router = Router();
router.get("/all", controller.getAll);
router.get("/:cid", controller.getCart);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.delete("/:cid/products/:pid", controller.remove);
router.post("/:cid/products/:pid", controller.addProduct);
router.delete("/:cid", controller.removeAll);
router.put("/:cid/products/:pid", controller.cambiarCantidad)

export default router;
