import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation/required-field-validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite/validation-composite";
import SignupValidationCompositeFactory from "./signup-validation-composite";

jest.mock("../../../presentation/helpers/validators/validation-composite/validation-composite");

const makeSut = () => {
  const validationComposite = SignupValidationCompositeFactory();
  return {
    sut: validationComposite,
  };
};

describe("ValidationComposite", () => {
  test("Should create a ValidationComposite instance correct validations", () => {
    const { sut } = makeSut();
    const validations = [
      new RequiredFieldValidation("name"),
      new RequiredFieldValidation("email"),
      new RequiredFieldValidation("password"),
      new RequiredFieldValidation("confirmationPassword"),
    ];
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
