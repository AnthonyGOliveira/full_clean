import {
  LoginModel,
  AuthenticationUseCase,
  AuthResponse,
} from "../../../domain/usecases/authentication-use-case";
import { InvalidParam } from "../../errors/invalid-param-error";
import { Unauthorized } from "../../errors/unauthorized-error";
import { badRequest, unauthorizedRequest } from "../../helpers/http-helpers";
import { Validation } from "../../helpers/validators/validation";
import { EmailValidator } from "../../protocols/email-validator";
import { LoginController } from "./login";

interface typeSut {
  sut: LoginController;
  useCase: AuthenticationUseCase;
  validation: Validation;
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub()
};

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
    expiresIn: "3600",
  };
  class AuthenticationUseCaseStub implements AuthenticationUseCase {
    execute(addAcount: LoginModel): Promise<AuthResponse | null> {
      return new Promise((resolve) => resolve(authResponseMock));
    }
  }

  return new AuthenticationUseCaseStub();
};

const makeSut = (): typeSut => {
  const useCaseStub = makeUseCaseStub();
  const validationStub = makeValidationStub();
  const loginController = new LoginController(useCaseStub, validationStub);
  return {
    sut: loginController,
    useCase: useCaseStub,
    validation: validationStub
  };
};

describe("LoginController", () => {
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

    const expectedCall: LoginModel = {
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

    const expectedCall: LoginModel = {
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
  test("Should return 200 if AuthenticationUseCase executed with success", async () => {
    const { sut, useCase } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    const useCaseSpy = jest.spyOn(useCase, "execute");

    const expectedCall: LoginModel = {
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    };

    const expectedResponse: AuthResponse = {
      accessToken: "any_access_token",
      expiresIn: "3600",
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(expectedResponse);
    expect(useCaseSpy).toHaveBeenCalledWith(expectedCall);
  });
  test("Should validation was called", async () => {
    const { sut, validation } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
      },
    };
    const spyValidation = jest.spyOn(validation, "validate");
    await sut.handle(httpRequest);
    expect(spyValidation).toHaveBeenCalled()
  });
  test("Should return 400 if validation return an error", async () => {
    const { sut, validation } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
      },
    };
    jest.spyOn(validation, "validate").mockReturnValue(new InvalidParam("email"))
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParam("email")));
  });
});
