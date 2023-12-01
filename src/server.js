import './db/database.js';
import express from 'express';
import morgan from 'morgan';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use('/carts', cartsRouter);
app.use('/products', productsRouter);

app.use(errorHandler);

const PORT = 8080;

app.listen(PORT, () => console.log(`SERVER UP ON PORT ${PORT}`));

