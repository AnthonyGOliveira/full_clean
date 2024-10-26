import { AddAcountModel } from "../../domain/models/add-acount-model";
import {
  AddAcount,
  AddAcountUseCase,
} from "../../domain/usecases/add-acount-use-case";
import { InvalidParam } from "../errors/invalid-param-error";
import { MissingParam } from "../errors/missing-param-error";
import { EmailValidator } from "../protocols/email-validator";
import { Logger } from "../protocols/logger";
import { SignUpController } from "./signup";

interface makeSutInterface {
  sut: SignUpController;
  emailValidator: EmailValidator;
  logger: Logger;
  useCase: AddAcountUseCase;
}

const makeSut = (): makeSutInterface => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  class LoggerStub implements Logger {
    info(): void {}
    debug(): void {}
    warning(): void {}
    error(): void {}
  }

  class AddAcountUseCaseStub implements AddAcountUseCase {
    async execute(addAcount: AddAcount): Promise<AddAcountModel> {
      return new Promise((resolve, reject) =>
        resolve({
          id: "valid_id",
          name: addAcount.name,
          email: addAcount.email,
          password: addAcount.password,
        })
      );
    }
  }
  const emailValidator = new EmailValidatorStub();
  const logger = new LoggerStub();
  const useCase = new AddAcountUseCaseStub();
  const sut = new SignUpController(emailValidator, useCase);
  return {
    sut,
    emailValidator,
    logger,
    useCase,
  };
};

describe("SignUp Controller", () => {
  test("Should return 400 if name is not provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParam("name"));
  });
  test("Should return 400 if email is not provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParam("email"));
  });
  test("Should return 400 if password is not provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParam("password"));
  });
  test("Should return 400 if confirmationPassword is not provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParam("confirmationPassword"));
  });
  test("Should return 400 if email is not valid", async () => {
    const { sut, emailValidator } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const emailValidatorSpy = jest
      .spyOn(emailValidator, "isValid")
      .mockReturnValueOnce(false);
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParam("email"));
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test("Should return 200 email validator called with correct value", async () => {
    const { sut, emailValidator } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const emailValidatorSpy = jest
      .spyOn(emailValidator, "isValid")
      .mockReturnValueOnce(true);
    const expectedResponse: AddAcountModel = {
      id: "valid_id",
      name: "any_name",
      email: "any_email",
      password: "any_password",
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(expectedResponse);
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test("Should return 500 if internal server error occurred", async () => {
    const { sut, emailValidator, logger } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const error = new Error("Error");
    error.stack = "any_stack";
    const emailValidatorSpy = jest
      .spyOn(emailValidator, "isValid")
      .mockImplementationOnce(() => {
        throw error;
      });
    const spyLoggerError = jest.spyOn(logger, "error");
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual({
      message: "Internal Server Error",
      stack: error.stack,
    });
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test("Should return 400 if confirmationPassword is not equal password", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        confirmationPassword: "another_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParam("confirmationPassword"));
  });
  test("Should return 500 if internal server error occurred in AddAcountUseCase", async () => {
    const { sut, logger, useCase } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const expectedCall: AddAcount = {
      name: "any_name",
      email: "any_email",
      password: "any_password",
    };
    const error = new Error("Error");
    error.stack = "any_stack";
    const useCaseSpy = jest
      .spyOn(useCase, "execute")
      .mockImplementationOnce(() => {
        throw error;
      });
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual({
      message: "Internal Server Error",
      stack: error.stack,
    });
    expect(useCaseSpy).toHaveBeenCalledWith(expectedCall);
  });
  test("Should return 200 if AddAcountUseCase executed with success", async () => {
    const { sut, emailValidator, logger, useCase } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const expectedCall: AddAcount = {
      name: "any_name",
      email: "any_email",
      password: "any_password",
    };
    const expectedResponse: AddAcountModel = {
      id: "valid_id",
      name: "any_name",
      email: "any_email",
      password: "any_password",
    };

    const useCaseSpy = jest.spyOn(useCase, "execute");
    const emailValidatorSpy = jest.spyOn(emailValidator, "isValid");

    const spyLoggerError = jest.spyOn(logger, "error");
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(expectedResponse);
    expect(useCaseSpy).toHaveBeenCalledWith(expectedCall);
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
    expect(spyLoggerError).not.toHaveBeenCalledWith(new Error("Error"));
  });
});
