import { InvalidParam } from "../errors/invalid-param-error";
import { MissingParam } from "../errors/missing-param-error";
import { ServerError } from "../errors/server-error";
import { EmailValidator } from "../protocols/email-validator";
import { Logger } from "../protocols/logger";
import { SignUpController } from "./signup";

const makeSut = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  class LoggerStub implements Logger {
    info():void {};
    debug():void {};
    warning():void {};
    error():void {};
  }
  const emailValidator = new EmailValidatorStub();
  const logger = new LoggerStub();
  const sut = new SignUpController(emailValidator, logger);
  return {
    sut,
    emailValidator,
    logger,
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
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      message: "Signup is successfull",
    });
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
    const emailValidatorSpy = jest
      .spyOn(emailValidator, "isValid")
      .mockImplementationOnce(() => {
        throw new Error("Error");
      });
    const spyLoggerError = jest.spyOn(logger, "error");
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
    expect(spyLoggerError).toHaveBeenCalledWith(new Error('Error'));
  });
  test("Should return 400 if confirmationPassword is not equal password", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        confirmationPassword: "another_password"
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParam("confirmationPassword"));
  });
});
