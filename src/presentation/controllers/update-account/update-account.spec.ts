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
  test("should return 500 if internal server error occurred in updateAcountController", async () => {
    const { sut } = makeSut();
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
    const spyController = jest.spyOn(sut, "handle");
    const httpResponse = await sut.handle(httpRequest);
    expect(spyController).toHaveBeenCalledWith(httpRequest);
    expect(httpResponse.body.message).toEqual("Internal Server Error");
    expect(httpResponse.body.stack).toBeTruthy();
    expect(httpResponse.statusCode).toBe(500);
  });
  test("should call validation when updateAcountController is called", async () => {
    const { sut, validation } = makeSut();
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
    const validationSpy = jest.spyOn(validation, "validate");
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
