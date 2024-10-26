import winston = require("winston");
import { Logger } from "../presentation/protocols/logger";
import { LoggerAdapter } from "./logger-adapter";

interface typeSut {
  sut: Logger;
  logger: winston.Logger;
}

const makeSut = (): typeSut => {
  const loggerStub = new LoggerAdapter();
  return {
    sut: loggerStub,
    logger: loggerStub.logger,
  };
};

describe("LoggerAdapter", () => {
  test("initialize adapter", () => {
    const { sut } = makeSut();
    const expectConfig = {
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf(
          ({ timestamp, level, message, stack, ...meta }) => {
            let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
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
        new winston.transports.File({ filename: "logs/app.log" }),
      ],
    };
    expect(winston.createLogger).toHaveBeenCalledWith(expectConfig);
  });
  test("should log info messages correctly", () => {
     const { sut, logger } = makeSut();
    const message = "Informational message";
    const meta = { userId: 123 };
    sut.info(message, meta);
    expect(logger.info).toHaveBeenCalledWith(message, meta);
  });

  test("should log error messages correctly", () => {
     const { sut, logger } = makeSut();
    const error = new Error("Something went wrong");
    const meta = { orderId: 456 };
    sut.error(error, meta);
    expect(logger.error).toHaveBeenCalledWith(error.message, {
      ...meta,
      stack: error.stack,
    });
  });

  test("should log error messages without meta correctly", () => {
     const { sut, logger } = makeSut();
    const error = new Error("Another error occurred");
    sut.error(error);
    expect(logger.error).toHaveBeenCalledWith(error.message, {
      message: "An error occurred",
      stack: error.stack,
    });
  });

  test("should log warning messages correctly", () => {
     const { sut, logger } = makeSut();
    const message = "Warning message";
    const meta = { module: "Auth" };
    sut.warning(message, meta);
    expect(logger.warn).toHaveBeenCalledWith(message, meta);
  });

  test("should log debug messages correctly", () => {
     const { sut, logger } = makeSut();
    const message = "Debugging message";
    const meta = { debugMode: true };
    sut.debug(message, meta);
    expect(logger.debug).toHaveBeenCalledWith(message, meta);
  });
});
