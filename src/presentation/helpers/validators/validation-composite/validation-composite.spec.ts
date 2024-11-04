import { Validation } from "../validation";
import { ValidationComposite } from "./validation-composite";

interface SutTypes {
  sut: ValidationComposite;
  validations: Validation[];
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validations = [makeValidationStub(), makeValidationStub()];
  const sut = new ValidationComposite(validations);
  return {
    sut,
    validations,
  };
};

describe("ValidationComposite", () => {
  test("Should return undefined if passed validation composite", () => {
    const { sut, validations } = makeSut();
    const input = {
      any_field: true,
      another: 2,
    };

    const spyValidation1 = jest.spyOn(validations[0], "validate");
    const spyValidation2 = jest.spyOn(validations[1], "validate");

    const error = sut.validate(input);

    expect(spyValidation1).toHaveBeenCalledWith(input);
    expect(spyValidation2).toHaveBeenCalledWith(input);
    expect(error).toBe(undefined);
  });
  test("Should return an error if not passed validation composite", () => {
    const { sut, validations } = makeSut();
    const input = {
      any_field: true,
      another: 2,
    };
    const mockError = new Error("any error");
    const spyValidation1 = jest
      .spyOn(validations[0], "validate")
      .mockReturnValue(mockError);
    const spyValidation2 = jest.spyOn(validations[1], "validate");

    const error = sut.validate(input);

    expect(spyValidation1).toHaveBeenCalledWith(input);
    expect(spyValidation2).not.toHaveBeenCalledWith(input);
    expect(error).toBe(mockError);
  });
  test("Should return first error if not passed validation composite", () => {
    const { sut, validations } = makeSut();
    const input = {
      any_field: true,
      another: 2,
    };
    const mockFirstError = new Error("first error");
    const mockSecondError = new Error("first error");
    const spyValidation1 = jest
      .spyOn(validations[0], "validate")
      .mockReturnValue(mockFirstError);
    const spyValidation2 = jest
      .spyOn(validations[1], "validate")
      .mockReturnValue(mockSecondError);

    const error = sut.validate(input);

    expect(spyValidation1).toHaveBeenCalledWith(input);
    expect(spyValidation2).not.toHaveBeenCalledWith(input);
    expect(error).toBe(mockFirstError);
  });
});
