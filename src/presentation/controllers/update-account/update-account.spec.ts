import { MissingParam } from "../../errors/missing-param-error";
import { badRequest } from "../../helpers/http-helpers";
import { Validation } from "../../helpers/validators/validation";
import { UpdateAccountController } from "./update-account";

type SutType = {
  validation: Validation;
  sut: UpdateAccountController;
};

const makeValidationCompositeStub = (): Validation => {
  class ValidationCompositeStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationCompositeStub();
};

const makeSut = (): SutType => {
  const validationStub = makeValidationCompositeStub();
  const sut = new UpdateAccountController(validationStub);
  return {
    sut,
    validation: validationStub,
  };
};

describe("UpdateAccountController", () => {
    const httpRequest = {
      body: {
        role: "any_role",
        name: "any_name",
        email: "any_email",
        old_password: "old_password",
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
});
