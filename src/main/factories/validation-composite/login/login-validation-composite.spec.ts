import { ValidationComposite } from "../../../../presentation/helpers/validators/validation-composite/validation-composite";
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
    const validations = [];
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
