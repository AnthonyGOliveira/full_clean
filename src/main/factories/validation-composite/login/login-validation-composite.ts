import { Validation } from "../../../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../../../presentation/helpers/validators/validation-composite/validation-composite";

export default (): Validation => {
  return new ValidationComposite([]);
};
