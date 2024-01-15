import { dirname } from "path";
import { fileURLToPath } from "url";
export const __dirname = dirname(fileURLToPath(import.meta.url));
import mongoStore from 'connect-mongo'
import bcryptjs from "bcryptjs";
import 'dotenv/config';

export const createHash = (password) =>
  bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcryptjs.compareSync(password, user.password);

export const createResponse = (res, statusCode, data) => {
  return res.status(statusCode).json({ data });
};

export const mongoStoreOptions = {
  store: mongoStore.create({
      mongoUrl: process.env.MONGO_LOCAL_URL,
      ttl: 120,
      crypto: {
          secret: '1234'
      }
  }),
  secret: "1234",
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 120000,
  },
};
