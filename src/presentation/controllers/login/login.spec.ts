import { AddAcountModel } from "../../../domain/models/add-acount-model";
import {
  FindAccount,
  FindAccountUseCase,
} from "../../../domain/usecases/find-account-use-case";
import { InvalidParam } from "../../errors/invalid-param-error";
import { MissingParam } from "../../errors/missing-param-error";
import { EmailValidator } from "../../protocols/email-validator";
import { LoginController } from "./login";

interface typeSut {
  sut: LoginController;
  useCase: FindAccountUseCase;
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

const makeUseCaseStub = (): FindAccountUseCase => {
  const addAcountMock: AddAcountModel = {
    id: "any_id",
    name: "any_name",
    email: "any_email",
    password: "hashed_password",
  };
  class FindAccountUseCaseStub implements FindAccountUseCase {
    execute(addAcount: FindAccount): Promise<AddAcountModel> {
      return new Promise((resolve) => resolve(addAcountMock));
    }
  }

  return new FindAccountUseCaseStub();
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParam("email"));
  });
  test("Should return 400 if request if not send password", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParam("password"));
  });
  test("Should return 500 if internal server error occurred in FindAccountUseCase", async () => {
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParam("email or password"));
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test("Should return 200 if FindAccountUseCase executed with success", async () => {
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

    const expectedResponse: AddAcountModel = {
      id: "any_id",
      name: "any_name",
      email: "any_email",
      password: "hashed_password",
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(expectedResponse);
    expect(useCaseSpy).toHaveBeenCalledWith(expectedCall);
  });
});
