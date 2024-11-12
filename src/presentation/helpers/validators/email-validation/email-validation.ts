import { InvalidParam } from "../../../errors/invalid-param-error";
import { EmailValidator } from "../../../protocols/email-validator";
import { Validation } from "../validation";

export class EmailValidation implements Validation {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  validate(input: any): Error {
    if (!this.emailValidator.isValid(input["email"])) {
      return new InvalidParam("email");
    }
  }
}
