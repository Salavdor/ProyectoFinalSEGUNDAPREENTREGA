import { Router } from 'express';
import * as controller from '../controllers/products.controllers.js';

const router = Router();

router.post('/', controller.createProduct);     

router.post('/add/:idUser/:idProduct', controller.addProductToUser); 

router.get('/:id', controller.getByIdProduct);


export default router;

