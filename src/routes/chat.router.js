import { Router } from "express";

const router = Router();

router.get("/",(req,res)=>{
    res.render('chat', {style: "chat.css"})
})


export default router;
