import { createTransport } from "nodemailer";
import "dotenv/config";

export const transporter = createTransport({
  host: process.env.ETHEREAL_HOST,
  port: process.env.PORT_ETHEREAL,
  auth: {
    user: process.env.ETHEREAL_EMAIL,
    pass: process.env.ETHEREAL_PASSWORD,
  },
});

