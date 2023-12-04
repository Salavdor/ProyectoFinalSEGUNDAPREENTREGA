import dotenv from "dotenv";
dotenv.config();
export const dbAdmin = process.env.DB_ADMIN;
export const dbPassword = process.env.DB_PASSWORD;
export const dbHost = process.env.DB_HOST;
