import { AddAcountUseCase } from "../../../domain/usecases/add-acount-use-case";
import { InvalidParam } from "../../errors/invalid-param-error";
import { MissingParam } from "../../errors/missing-param-error";
import { badRequest, ok, serverError } from "../../helpers/http-helpers";
import { Validation } from "../../helpers/validators/validation";
import { Controller } from "../../protocols/controller";
import { EmailValidator } from "../../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class SignUpController implements Controller {
  emailValidator: EmailValidator;
  addAcountUseCase: AddAcountUseCase;
  validation: Validation;
  constructor(
    emailValidator: EmailValidator,
    addAcountUseCase: AddAcountUseCase,
    validation: Validation
  ) {
    this.emailValidator = emailValidator;
    this.addAcountUseCase = addAcountUseCase;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }
      const { email, password, confirmationPassword, name } = httpRequest.body;
      if (password != confirmationPassword) {
        return badRequest(new InvalidParam("confirmationPassword"));
      }
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParam("email"));
      }
      const addAcount = {
        name: name,
        email: email,
        password: password,
      };
      const result = await this.addAcountUseCase.execute(addAcount);

      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
