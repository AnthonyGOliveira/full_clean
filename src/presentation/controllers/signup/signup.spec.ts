import { AddAcountModel } from "../../../domain/models/add-acount-model";
import {
  AddAcount,
  AddAcountUseCase,
} from "../../../domain/usecases/add-acount-use-case";
import { InvalidParam } from "../../errors/invalid-param-error";
import { MissingParam } from "../../errors/missing-param-error";
import { badRequest } from "../../helpers/http-helpers";
import { Validation } from "../../helpers/validators/validation";
import { EmailValidator } from "../../protocols/email-validator";
import { Logger } from "../../protocols/logger";
import { SignUpController } from "./signup";

interface makeSutInterface {
  sut: SignUpController;
  emailValidator: EmailValidator;
  logger: Logger;
  useCase: AddAcountUseCase;
  validation: Validation;
}

const makeValidationCompositeStub = (): Validation => {
  class ValidationCompositeStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationCompositeStub();
};

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
  const validationStub = makeValidationCompositeStub();
  const emailValidator = new EmailValidatorStub();
  const logger = new LoggerStub();
  const useCase = new AddAcountUseCaseStub();
  const sut = new SignUpController(emailValidator, useCase, validationStub);
  return {
    sut,
    emailValidator,
    logger,
    useCase,
    validation: validationStub,
  };
};

describe("SignUp Controller", () => {
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
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
    expect(httpResponse).toEqual(badRequest(new InvalidParam("email")));
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

  test("Should call validation when SignUpController is called", async () => {
    const { sut, validation } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const validationSpy = jest.spyOn(validation, "validate");
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("Should return 400 if validation return an error", async () => {
    const { sut, validation } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const error = new MissingParam("any_param");
    const validationSpy = jest
      .spyOn(validation, "validate")
      .mockReturnValueOnce(error);
    const httpResponse = await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
    expect(httpResponse).toEqual(badRequest(error));
  });
});
