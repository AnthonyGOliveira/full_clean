import winston from "winston";
import { Logger } from "../presentation/protocols/logger";
import { config } from "../main/config/config";

export class LoggerAdapter implements Logger {
  logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
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
    });
  }
  info(message: string, meta: any): void {
    this.logger.info(message, meta);
  }
  error(error: Error, meta?: any): void {
    this.logger.error(error.message, {
      ...((meta && { ...meta, stack: error.stack }) ?? {
        message: "An error occurred",
        stack: error.stack,
      }),
    });
  }
  warning(message: string, meta: any): void {
    this.logger.warn(message, meta);
  }
  debug(message: string, meta: any): void {
    this.logger.debug(message, meta);
  }
}
