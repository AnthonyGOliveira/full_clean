import { EmailValidation } from "../../../../presentation/helpers/validators/email-validation/email-validation";
import { RequiredFieldValidation } from "../../../../presentation/helpers/validators/required-field-validation/required-field-validation";
import { Validation } from "../../../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../../../presentation/helpers/validators/validation-composite/validation-composite";
import { EmailValidatorAdapter } from "../../../../utils/email-validator-adapter";

export default (): Validation => {
  const emailValidator = new EmailValidatorAdapter();
  return new ValidationComposite([
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new EmailValidation(emailValidator),
  ]);
};
