import { Router } from 'express';
// import { checkAuth } from '../middlewares/authJwt.js';
import passport from "passport";
import TicketController from '../controllers/ticket.controllers.js';
const controller = new TicketController();

const router = Router();

router
        
        .get("/", controller.getTicket)

        .get("/:tid", controller.getTicketById)

export default router;

