// import winston from "winston";
import 'winston-mongodb';

import { createLogger, format, transports } from "winston";
const { combine, printf, timestamp, colorize } = format;


const logConfig = {
    level: "debug",
    format: combine(
      timestamp({
        format: "MM-DD-YYYY HH:mm:ss",
      }),
      colorize(),
      printf((info) => `${info.level} | ${[info.timestamp]} | ${info.message}`)
    ),
    transports: [new transports.Console()],
    // transports: [
    //     winston.add(new winston.transports.MongoDB({
    //         options: { useUnifiedTopology: true },
    //         db: MONGO_LOCAL_URL,
    //         collection: 'logs',
    //         tryReconnect: true,
    //         level: 'error',
    //     }))
    // ]
}

export const logger = createLogger(logConfig);

// export const ejemplo3 = () => {
//     logger.silly('imprimimos silly')
//     logger.debug('imprimimos debug')
//     logger.verbose('imprimimos verbose')
//     logger.info('imprimimos info')
//     logger.http('imprimimos http')
//     logger.warn('imprimimos warn')
//     logger.error('imprimimos error')
// }
