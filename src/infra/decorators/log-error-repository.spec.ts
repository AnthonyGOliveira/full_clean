import { LogErrorRepositoryDecorator } from "./log-error-repository";
import { MongoDatabaseHelper } from "../db/mongodb/helpers/mongodb-helper";
import { Collection, Document } from "mongodb";

let insertOneMock = jest.fn();

jest.mock("../db/mongodb/helpers/mongodb-helper", () => {
  return {
    MongoDatabaseHelper: {
      connect: jest.fn(),
      disconnect: jest.fn(),
      getCollection: jest.fn(),
    },
  };
});

interface ILogError {
  error: Error;
  meta: any;
}

interface Logger {
  info(message: string, meta: any): void;
  error(error: Error, meta?: any): void;
  warning(message: string, meta: any): void;
  debug(message: string, meta: any): void;
}

const makeLoggerAdapter = () => {
  class LoggerAdapter implements Logger {
    info(message: string, meta: any): void {
      jest.fn();
    }
    error(error: Error, meta?: any): void {
      jest.fn();
    }
    warning(message: string, meta: any): void {
      jest.fn();
    }
    debug(message: string, meta: any): void {
      jest.fn();
    }
  }

  return new LoggerAdapter();
};

const makeSut = () => {
  const logger = makeLoggerAdapter();
  const decorator = new LogErrorRepositoryDecorator(logger);
  return {
    sut: decorator,
    logger,
  };
};

describe("LogErrorRepositoryDecorator", () => {
  beforeAll(() => {
    jest
      .spyOn(MongoDatabaseHelper, "getCollection")
      .mockImplementation((): Promise<Collection<Document>> => {
        return new Promise(
          (resolve) =>
            resolve({
              insertOne: insertOneMock,
            } as unknown as Collection<Document>) // Conversão para simular uma Collection
        );
      });
  });
  test("Should insert error log in database", async () => {
    const { sut, logger } = makeSut();
    const decoratorSpy = jest.spyOn(sut, "error");
    const loggerSpy = jest.spyOn(logger, "error");
    const error = new Error("Error");
    const meta = { any: "any_value" };
    const errorLog: ILogError = {
      error: error,
      meta: meta,
    };
    await sut.error(error, meta);
    expect(decoratorSpy).toHaveBeenCalledWith(error, meta);
    expect(loggerSpy).toHaveBeenCalledWith(error, meta);
    expect(MongoDatabaseHelper.getCollection).toHaveBeenCalledWith("log-error");
    expect(insertOneMock).toHaveBeenCalledWith(errorLog);
  });
  test("should call warning method", () => {
    const { sut, logger } = makeSut();
    const loggerSpy = jest.spyOn(logger, "warning");
    const meta = { any: "any_value" };
    const message = "message_warning";
    sut.warning(message, meta);
    expect(loggerSpy).toHaveBeenCalledWith(message, meta);
  });
  test("should call debug method", () => {
    const { sut, logger } = makeSut();
    const loggerSpy = jest.spyOn(logger, "debug");
    const meta = { any: "any_value" };
    const message = "message_debug";
    sut.debug(message, meta);
    expect(loggerSpy).toHaveBeenCalledWith(message, meta);
  });
});
