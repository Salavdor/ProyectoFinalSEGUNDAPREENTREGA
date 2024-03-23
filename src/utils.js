import { dirname } from "path";
import { fileURLToPath } from "url";
export const __dirname = dirname(fileURLToPath(import.meta.url));
import mongoStore from 'connect-mongo'
import bcryptjs from "bcryptjs";
import 'dotenv/config';

export const createHash = (password) =>
  bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));

export const isValidPassword = (password, user) =>
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

// comparador de fechas

const padToTwoDigits = (num) => {
  return num.toString().padStart(2, '0')
}

export const convertMsToHHMMSS = (ms) => {
  let seconds = Math.floor(ms / 1000)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)

  seconds = seconds % 60
  minutes = minutes % 60
  hours = hours % 24

  seconds = padToTwoDigits(seconds)
  minutes = padToTwoDigits(minutes)
  hours = padToTwoDigits(hours)

  return `${hours}${minutes}${seconds}`
}



