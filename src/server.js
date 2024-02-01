import express, { json, urlencoded } from 'express';
import session from "express-session";
import morgan from 'morgan';
import handlebars from 'express-handlebars';
import cookieParser from "cookie-parser";
import { __dirname, mongoStoreOptions } from './utils.js';

import MainRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

import passport from "passport";
import "./strategies/jwt.js";

import 'dotenv/config';

const app = express();
const mainRouter = new MainRouter();

app
    .use(json())
    .use(urlencoded({extended: true}))
    .use(morgan('dev'))

    // -----------------------------------------------------  //
    //              SETTING OF THE VIEWS                      //
    // -----------------------------------------------------  //
    .use(express.static(__dirname + '/public'))
    .engine('handlebars', handlebars.engine())
    .set('views', __dirname + '/views')
    .set('view engine', 'handlebars')
    // -----------------------------------------------------  //

    
    // -----------------------------------------------------  //
    //              session y uso de cookies                  //
    // -----------------------------------------------------  //
    .use(cookieParser())
    .use(session(mongoStoreOptions))
    // -----------------------------------------------------  //


    // -----------------------------------------------------  //
    //    inicializa las estrategias Passport Globalmente     //
    // -----------------------------------------------------  //
    .use(passport.initialize())
    .use(passport.session())
    // -----------------------------------------------------  //

    // -----------------------------------------------------  //
    //                      Main router                       //
    // -----------------------------------------------------  //
    .use('/api', mainRouter.getRouter())
    // -----------------------------------------------------  //


    .use(errorHandler)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 SERVER UP ON PORT ${PORT}`));
