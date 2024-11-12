import { MissingParam } from "../../errors/missing-param-error";
import {
  badRequest,
  serverError,
  ok,
  unauthorizedRequest,
} from "../../helpers/http-helpers";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { AuthenticationUseCase } from "../../../domain/usecases/authentication-use-case";
import { EmailValidator } from "../../protocols/email-validator";
import { InvalidParam } from "../../errors/invalid-param-error";
import { Unauthorized } from "../../errors/unauthorized-error";
import { Validation } from "../../helpers/validators/validation";

export class LoginController implements Controller {
  private readonly authenticationUseCase: AuthenticationUseCase;
  private readonly emailValidator: EmailValidator;
  private readonly validation: Validation;
  constructor(
    authenticationUseCase: AuthenticationUseCase,
    emailValidator: EmailValidator,
    validation: Validation
  ) {
    this.authenticationUseCase = authenticationUseCase;
    this.emailValidator = emailValidator;
    this.validation = validation;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }
      const validateFields = ["email", "password"];
      for (const field of validateFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParam(field));
        }
      }
      const { email, password } = httpRequest.body;

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParam("email or password"));
      }
      const result = await this.authenticationUseCase.execute({
        email,
        password,
      });
      if (!result) {
        return unauthorizedRequest(new Unauthorized());
      }
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
