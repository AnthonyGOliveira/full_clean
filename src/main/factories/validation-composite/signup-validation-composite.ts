import { CompareFieldsValidation } from "../../../presentation/helpers/validators/compare-fields-validation/compare-fields-validation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation/required-field-validation";
import { Validation } from "../../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite/validation-composite";

export default (): Validation => {
  return new ValidationComposite([
    new RequiredFieldValidation("name"),
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new RequiredFieldValidation("confirmationPassword"),
    new CompareFieldsValidation("password", "confirmationPassword"),
  ]);
};
