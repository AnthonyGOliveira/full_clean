import winston from "winston";
import { Logger } from "../presentation/protocols/logger";
import configLogger from "../main/config/logger";

export class LoggerAdapter implements Logger {
  logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger(configLogger);
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
