import express, { json, urlencoded } from 'express';
import session from "express-session";
import morgan from 'morgan';
import cookieParser from "cookie-parser";


import MainRouter from './routes/index.js';
import { __dirname, mongoStoreOptions } from './utils.js';
import { errorHandler } from './middlewares/errorHandler.js';

import passport from "passport";
import mongoStore from 'connect-mongo'
import "./strategies/jwt.js";

import 'dotenv/config';

const app = express();
const mainRouter = new MainRouter();

app
    .use(json())
    .use(urlencoded({extended: true}))
    .use(morgan('dev'))

    //session y uso de cookies
    .use(cookieParser())
    .use(session(mongoStoreOptions))

    //inicializa las estrategias Passpor Globalmente
    .use(passport.initialize())
    .use(passport.session())

    .use('/api', mainRouter.getRouter())

    .use(errorHandler)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`SERVER UP ON PORT ${PORT}`));
