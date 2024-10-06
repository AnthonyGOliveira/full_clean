import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(email: string): boolean {
    return true;
  },
}));

const makeSut = () => {
  const emailValidator = new EmailValidatorAdapter();
  return {
    emailValidator,
  };
};

describe("EmailValidatorAdapter", () => {
  test("should return true if email is valid", () => {
    const { emailValidator } = makeSut();
    const email = "valid_email@mail.com";
    const result = emailValidator.isValid(email);
    expect(result).toBe(true);
  });
  test("should return false if email is invalid", () => {
    jest.spyOn(validator, "isEmail").mockReturnValue(false);
    const { emailValidator } = makeSut();
    const email = "invalid_email@mail.com";
    const result = emailValidator.isValid(email);
    expect(result).toBe(false);
  });
  test("should call emailValidator with correct value", () => {
    const validatorSpy = jest.spyOn(validator, "isEmail").mockReturnValue(true);
    const { emailValidator } = makeSut();
    const email = "valid_email@mail.com";
    const result = emailValidator.isValid(email);
    expect(result).toBe(true);
    expect(validatorSpy).toHaveBeenCalledWith(email);
  });
});
