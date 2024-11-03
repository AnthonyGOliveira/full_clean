import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import ValidationCompositeFactory from "./validation-composite";

jest.mock("../../../presentation/helpers/validators/validation-composite");

const makeSut = () => {
  const validationComposite = ValidationCompositeFactory();
  return {
    sut: validationComposite,
  };
};

describe("ValidationComposite", () => {
  test("Should create a ValidationComposite instance correct validations", () => {
    const { sut } = makeSut();
    expect(ValidationComposite).toHaveBeenCalledWith([]);
  });
});
