import { InvalidParam } from "../../../errors/invalid-param-error";
import { CompareFieldsValidation } from "./compare-fields-validation";

const makeSut = (field: string, compareField: string) => {
  const sut = new CompareFieldsValidation(field, compareField);
  return {
    sut,
  };
};

describe("CompareFieldsValidation", () => {
  test("Should return undefined if field is equal to compareField", () => {
    const input = {
      password: "any_password",
      confirmationPassword: "any_password",
    };
    const field = "password";
    const compareField = "confirmationPassword";
    const { sut } = makeSut(field, compareField);
    const spyValidate = jest.spyOn(sut, "validate");
    const error = sut.validate(input);
    expect(error).toBeFalsy();
    expect(spyValidate).toHaveBeenCalledWith(input);
  });
  test("Should return InvalidParam error if field is not equal to compareField", () => {
    const input = {
      password: "any_password",
      confirmationPassword: "other_password",
    };
    const field = "password";
    const compareField = "confirmationPassword";
    const { sut } = makeSut(field, compareField);
    const spyValidate = jest.spyOn(sut, "validate");
    const error = sut.validate(input);
    expect(error).toEqual(new InvalidParam(compareField));
    expect(spyValidate).toHaveBeenCalledWith(input);
  });
});
