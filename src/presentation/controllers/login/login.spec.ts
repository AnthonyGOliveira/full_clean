import {
  FindAccount,
  AuthenticationUseCase,
  AuthResponse,
} from "../../../domain/usecases/authentication-use-case";
import { InvalidParam } from "../../errors/invalid-param-error";
import { MissingParam } from "../../errors/missing-param-error";
import { Unauthorized } from "../../errors/unauthorized-error";
import { badRequest, unauthorizedRequest } from "../../helpers/http-helpers";
import { EmailValidator } from "../../protocols/email-validator";
import { LoginController } from "./login";

interface typeSut {
  sut: LoginController;
  useCase: AuthenticationUseCase;
  emailValidator: EmailValidator;
}

const makeEmailValdiatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeUseCaseStub = (): AuthenticationUseCase => {
  const authResponseMock: AuthResponse = {
    accessToken: "any_access_token",
    expiresIn: 3600,
  };
  class AuthenticationUseCaseStub implements AuthenticationUseCase {
    execute(addAcount: FindAccount): Promise<AuthResponse | null> {
      return new Promise((resolve) => resolve(authResponseMock));
    }
  }

  return new AuthenticationUseCaseStub();
};

const makeSut = (): typeSut => {
  const useCaseStub = makeUseCaseStub();
  const emailValidator = makeEmailValdiatorStub();
  const loginController = new LoginController(useCaseStub, emailValidator);
  return {
    sut: loginController,
    useCase: useCaseStub,
    emailValidator,
  };
};

describe("LoginController", () => {
  test("Should return 400 if request if not send email", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParam("email")));
  });
  test("Should return 400 if request if not send password", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParam("password")));
  });
  test("Should return 401 if AuthenticationUseCase not return AuthenticationResponse", async () => {
    const { sut, useCase } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    const useCaseSpy = jest
      .spyOn(useCase, "execute")
      .mockImplementationOnce(() => null);

    const expectedCall: FindAccount = {
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorizedRequest(new Unauthorized()));
    expect(useCaseSpy).toHaveBeenCalledWith(expectedCall);
  });
  test("Should return 500 if internal server error occurred in AuthenticationUseCase", async () => {
    const { sut, useCase } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const error = new Error("Error");
    error.stack = "any_stack";

    const useCaseSpy = jest
      .spyOn(useCase, "execute")
      .mockImplementationOnce(() => {
        throw error;
      });

    const expectedCall: FindAccount = {
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual({
      message: "Internal Server Error",
      stack: error.stack,
    });
    expect(useCaseSpy).toHaveBeenCalledWith(expectedCall);
  });
  test("Should return 500 if internal server error occurred in EmailValidator", async () => {
    const { sut, emailValidator } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const error = new Error("Error");
    error.stack = "any_stack";

    const emailValidatorSpy = jest
      .spyOn(emailValidator, "isValid")
      .mockImplementationOnce(() => {
        throw error;
      });

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual({
      message: "Internal Server Error",
      stack: error.stack,
    });
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test("Should return 400 if EmailValidator return false", async () => {
    const { sut, emailValidator } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const error = new Error("Error");
    error.stack = "any_stack";

    const emailValidatorSpy = jest
      .spyOn(emailValidator, "isValid")
      .mockReturnValueOnce(false);

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new InvalidParam("email or password"))
    );
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test("Should return 200 if AuthenticationUseCase executed with success", async () => {
    const { sut, useCase } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    const useCaseSpy = jest.spyOn(useCase, "execute");

    const expectedCall: FindAccount = {
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    };

    const expectedResponse: AuthResponse = {
      accessToken: "any_access_token",
      expiresIn: 3600,
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(expectedResponse);
    expect(useCaseSpy).toHaveBeenCalledWith(expectedCall);
  });
});
