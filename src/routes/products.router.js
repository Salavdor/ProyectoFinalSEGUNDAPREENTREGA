import { Router } from "express";
// import socketServer from "../app.js";
import * as controller from "../controllers/product.controller.js";

const router = Router();

router.get("/?filter", controller.aggregation1);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.delete("/:id", controller.remove);
router.put("/:id", controller.update);

export default router;
