import { EmailValidation } from "../../../../presentation/helpers/validators/email-validation/email-validation";
import { RequiredFieldValidation } from "../../../../presentation/helpers/validators/required-field-validation/required-field-validation";
import { ValidationComposite } from "../../../../presentation/helpers/validators/validation-composite/validation-composite";
import { EmailValidatorAdapter } from "../../../../utils/email-validator-adapter";
import LoginValidationCompositeFactory from "./login-validation-composite";

jest.mock(
    "../../../../presentation/helpers/validators/validation-composite/validation-composite"
  );
  
const makeSut = () => {
  const validationComposite = LoginValidationCompositeFactory();
  return {
    sut: validationComposite,
  };
};

describe("LoginValidationComposite", () => {
  test("should create LoginValidationComposite instance correct validations", () => {
    const { sut } = makeSut();
    const validations = [
      new RequiredFieldValidation("email"),
      new RequiredFieldValidation("password"),
      new EmailValidation(new EmailValidatorAdapter()),
    ];
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
