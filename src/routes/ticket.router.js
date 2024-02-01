import { Router } from 'express';
// import { checkAuth } from '../middlewares/authJwt.js';
import passport from "passport";
import TicketController from '../controllers/ticket.controllers.js';
const controller = new TicketController();

const router = Router();

router
        
        .get("/",passport.authenticate("jwtCookiesAdmin"), controller.getTicket)

        .get("/:tid",passport.authenticate("jwtCookiesAdmin"), controller.getTicketById)

export default router;

