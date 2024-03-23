import { connect } from "mongoose";
import { logger } from "../../logs/winstonlog.js";
import 'dotenv/config';

export const initMongoDB = async() => {
  try {
    await connect(
      process.env.MONGO_ATLAS_URL
    );
    logger.info(`💾 Conectado a la base de datos MongoDB`);
  } catch (error) {
    logger.error(`💾 Error al conectar a la base de datos MongoDB`);
    throw new Error(error.message);
  }
}
