import winston from "winston";
import { config } from "./config";

export default {
    level: config.logger.level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.printf(
        ({ timestamp, level, message, stack, ...meta }) => {
          let logMessage: string = `${timestamp} [${level.toUpperCase()}]: ${message}`;
          if (stack) {
            logMessage += ` - ${stack}`;
          }
          if (Object.keys(meta).length) {
            logMessage += ` - ${JSON.stringify(meta)}`;
          }
          return logMessage;
        }
      )
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: config.logger.filenamePath }),
    ],
  }