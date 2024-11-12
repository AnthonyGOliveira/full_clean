import { InvalidParam } from "../../../errors/invalid-param-error";
import { EmailValidator } from "../../../protocols/email-validator";
import { EmailValidation } from "./email-validation";
type stubType = {
  sut: EmailValidation;
  emailValidator: EmailValidator;
};

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = (): stubType => {
  const emailValidator = makeEmailValidatorStub();
  const sut = new EmailValidation(emailValidator);
  return {
    sut,
    emailValidator,
  };
};

describe("EmailValidation", () => {
  test("Should return undefined if email is valid", () => {
    const { sut, emailValidator } = makeSut();
    const spyValidate = jest.spyOn(sut, "validate");
    const spyEmailValidator = jest.spyOn(emailValidator, "isValid");
    const input = {
      email: "any_email@mail.com",
    };
    const error = sut.validate(input);
    expect(error).toBe(undefined);
    expect(spyValidate).toHaveBeenCalledWith(input);
    expect(spyEmailValidator).toHaveBeenCalledWith(input.email);
  });
  test("Should return InvalidParam error if email is not valid", () => {
    const { sut, emailValidator } = makeSut();
    const spyValidate = jest.spyOn(sut, "validate");
    const spyEmailValidator = jest
      .spyOn(emailValidator, "isValid")
      .mockReturnValueOnce(false);
    const input = {
      email: "any_email",
    };
    const error = sut.validate(input);
    expect(error).toEqual(new InvalidParam("email"));
    expect(spyValidate).toHaveBeenCalledWith(input);
    expect(spyEmailValidator).toHaveBeenCalledWith(input.email);
  });
  test("Should return an error if emailValidator throw error", () => {
    const { sut, emailValidator } = makeSut();
    const spyValidate = jest.spyOn(sut, "validate");
    const errorMock = new Error("Any error");
    const spyEmailValidator = jest
      .spyOn(emailValidator, "isValid")
      .mockImplementation(() => {
        throw errorMock;
      });
    const input = {
      email: "any_email",
    };
    try {
      expect(sut.validate(input)).toThrow();
    } catch (error) {
      expect(error).toEqual(errorMock);
      expect(spyValidate).toHaveBeenCalledWith(input);
      expect(spyEmailValidator).toHaveBeenCalledWith(input.email);
    }
  });
});
