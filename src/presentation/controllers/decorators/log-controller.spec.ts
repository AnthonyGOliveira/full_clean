import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { LogControllerDecorator } from "./log-controller";
import { Logger } from "../../protocols/logger";

const loggerMock = {
  info: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  debug: jest.fn(),
};

const makeControllerStub = (): Controller => {
  const response: HttpResponse = {
    statusCode: 200,
    body: { any: "any_value" },
  };
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(response));
    }
  }

  return new ControllerStub();
};

const makeLoggerStub = (): Logger => {
  class LoggerStub implements Logger {
    info(message: string, meta: any): void {
      loggerMock.info(message, meta);
    }
    error(error: Error, meta?: any): void {
      loggerMock.error(error, meta);
    }
    warning(message: string, meta: any): void {
      loggerMock.warning(message, meta);
    }
    debug(message: string, meta: any): void {
      loggerMock.debug(message, meta);
    }
  }

  return new LoggerStub();
};

type sutType = {
  controller: Controller;
  logger: Logger;
  sut: LogControllerDecorator;
};

const makeSut = (): sutType => {
  const controllerStub = makeControllerStub();
  const loggerStub = makeLoggerStub();
  const sut = new LogControllerDecorator(controllerStub, loggerStub);

  return {
    controller: controllerStub,
    logger: loggerStub,
    sut,
  };
};

describe("LogControllerDecorator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  test("Should return response with status 200", async () => {
    const { sut, logger, controller } = makeSut();
    const request: HttpRequest = {
      body: {
        test: "test1",
      },
      method: "POST",
      url: "/teste/log/decorator",
    };
    const controllerSpy = jest.spyOn(controller, "handle");
    await sut.handle(request);
    expect(controllerSpy).toHaveBeenCalledWith(request);
    expect(loggerMock.info).toHaveBeenCalledTimes(2);
    expect(loggerMock.info).toHaveBeenCalledWith(
      "Starting request - POST - /teste/log/decorator",
      { body: { test: "test1" } }
    );
    expect(loggerMock.info).toHaveBeenCalledWith(
      "Ending request - POST - /teste/log/decorator",
      { any: "any_value" }
    );
    expect(loggerMock.error).not.toHaveBeenCalled();
  });
  test("Should return response with status 500", async () => {
    const { sut, logger, controller } = makeSut();
    const request: HttpRequest = {
      body: {
        test: "test1",
      },
      method: "POST",
      url: "/teste/log/decorator",
    };
    const response: HttpResponse = {
      statusCode: 500,
      body: {
        message: "Message Error",
        stack: "any_stack",
      },
    };
    const controllerSpy = jest
      .spyOn(controller, "handle")
      .mockImplementation(() => new Promise((resolve) => resolve(response)));
    await sut.handle(request);
    expect(controllerSpy).toHaveBeenCalledWith(request);
    expect(loggerMock.info).toHaveBeenCalledTimes(1);
    expect(loggerMock.info).toHaveBeenCalledWith(
      "Starting request - POST - /teste/log/decorator",
      { body: { test: "test1" } }
    );
    const error = new Error(response.body.message);
    error.stack = response.body.stack;
    expect(loggerMock.error).toHaveBeenCalledWith(error, {
      body: request.body,
    });
  });
  test("Should return response with status 500 and empty body", async () => {
    const { sut, logger, controller } = makeSut();
    const request: HttpRequest = {
      body: {
        test: "test1",
      },
      method: "POST",
      url: "/teste/log/decorator",
    };
    const response: HttpResponse = {
      statusCode: 500,
      body: {},
    };
    const controllerSpy = jest
      .spyOn(controller, "handle")
      .mockImplementation(() => new Promise((resolve) => resolve(response)));
    await sut.handle(request);
    expect(controllerSpy).toHaveBeenCalledWith(request);
    expect(loggerMock.info).toHaveBeenCalledTimes(1);
    expect(loggerMock.info).toHaveBeenCalledWith(
      "Starting request - POST - /teste/log/decorator",
      { body: { test: "test1" } }
    );
    const error = new Error("Internal Server Error");
    expect(loggerMock.error).toHaveBeenCalledWith(error, {
      body: request.body,
    });
  });
});
