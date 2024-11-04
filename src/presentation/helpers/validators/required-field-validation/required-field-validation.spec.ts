import { MissingParam } from "../../../errors/missing-param-error";
import { RequiredFieldValidation } from "./required-field-validation";

const makeSut = (field: string) => {
  const sut = new RequiredFieldValidation(field);
  return {
    sut,
  };
};
describe("RequiredFieldValidation", () => {
  test("Should return undefined if field exists in input", () => {
    const field = "any_field";
    const { sut } = makeSut(field);
    const spyValidate = jest.spyOn(sut, "validate");
    const input = {
      any_field: true,
    };
    const error = sut.validate(input);
    expect(error).toBe(undefined);
    expect(spyValidate).toHaveBeenCalledWith(input);
  });
  test("Should return MissingParam if field not exists in input", () => {
    const field = "other_field";
    const { sut } = makeSut(field);
    const spyValidate = jest.spyOn(sut, "validate");
    const input = {
      any_field: true,
    };
    const error = sut.validate(input);
    expect(error).toEqual(new MissingParam(field));
    expect(spyValidate).toHaveBeenCalledWith(input);
  });
});
