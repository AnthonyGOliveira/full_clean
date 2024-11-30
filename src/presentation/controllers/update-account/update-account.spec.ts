import {
  UpdateAccount,
  UpdateAccountResponse,
  UpdateAccountUseCase,
} from "../../../domain/usecases/update-account-use-case";
import { MissingParam } from "../../errors/missing-param-error";
import { InvalidRequest } from "../../errors/invalid-request";
import { badRequest, serverError } from "../../helpers/http-helpers";
import { Validation } from "../../helpers/validators/validation";
import { UpdateAccountController } from "./update-account";
import { UpdateAccountUseCaseMapper } from "../mappers/update-account";

type SutType = {
  validation: Validation;
  useCase: UpdateAccountUseCase;
  sut: UpdateAccountController;
  mapper: UpdateAccountUseCaseMapper;
};

const makeValidationCompositeStub = (): Validation => {
  class ValidationCompositeStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationCompositeStub();
};

const makeUseCaseStub = (): UpdateAccountUseCase => {
  class UpdateAccountUseCaseStub implements UpdateAccountUseCase {
    async execute(
      updateAccount: Partial<UpdateAccount>
    ): Promise<UpdateAccountResponse | null> {
      return new Promise((resolve, reject) =>
        resolve({
          message: "Account updated successfully.",
        })
      );
    }
  }

  return new UpdateAccountUseCaseStub();
};

const makeSut = (): SutType => {
  const validationStub = makeValidationCompositeStub();
  const useCaseStub = makeUseCaseStub();
  const mapper = new UpdateAccountUseCaseMapper();
  const sut = new UpdateAccountController(validationStub, useCaseStub, mapper);
  return {
    sut,
    validation: validationStub,
    useCase: useCaseStub,
    mapper,
  };
};

describe("UpdateAccountController", () => {
  const httpRequest = {
    body: {
      id: "any_id",
      role: "any_role",
      name: "any_name",
      email: "any_email",
      oldPassword: "old_password",
      password: "any_password",
      confirmationPassword: "any_password",
    },
  };
  test("should return 500 if internal server error occurred in updateAcountController", async () => {
    const { sut } = makeSut();
    const spyController = jest.spyOn(sut, "handle");
    const httpResponse = await sut.handle(httpRequest);
    expect(spyController).toHaveBeenCalledWith(httpRequest);
    expect(httpResponse.body.message).toEqual("Internal Server Error");
    expect(httpResponse.body.stack).toBeTruthy();
    expect(httpResponse.statusCode).toBe(500);
  });
  test("should call validation when updateAcountController is called", async () => {
    const { sut, validation } = makeSut();
    const validationSpy = jest.spyOn(validation, "validate");
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("should return 400 if validation return an error", async () => {
    const { sut, validation } = makeSut();
    const error = new MissingParam("any_param");
    const validationSpy = jest
      .spyOn(validation, "validate")
      .mockReturnValueOnce(error);
    const httpResponse = await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
    expect(httpResponse).toEqual(badRequest(error));
  });
  test("should return 500 if internal server error occurred in AddAcountUseCase", async () => {
    const { sut, useCase, mapper } = makeSut();
    const error = new Error("Error");
    error.stack = "any_stack";
    jest.spyOn(useCase, "execute").mockImplementationOnce(() => {
      throw error;
    });
    const spyMapper = jest.spyOn(mapper, "toUseCase");
    const httpResponse = await sut.handle(httpRequest);
    expect(spyMapper).toHaveBeenCalledWith(httpRequest.body);
    expect(httpResponse).toEqual(serverError(error));
  });
  test("should return 400 if usecase return null", async () => {
    const { sut, useCase } = makeSut();
    jest.spyOn(useCase, "execute").mockResolvedValueOnce(null);
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidRequest()));
  });
});
