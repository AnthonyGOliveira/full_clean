import {
  badRequest,
  serverError,
  ok,
  unauthorizedRequest,
} from "../../helpers/http-helpers";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { AuthenticationUseCase } from "../../../domain/usecases/authentication-use-case";
import { Unauthorized } from "../../errors/unauthorized-error";
import { Validation } from "../../helpers/validators/validation";

export class LoginController implements Controller {
  private readonly authenticationUseCase: AuthenticationUseCase;
  private readonly validation: Validation;
  constructor(
    authenticationUseCase: AuthenticationUseCase,
    validation: Validation
  ) {
    this.authenticationUseCase = authenticationUseCase;
    this.validation = validation;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }
      const { email, password } = httpRequest.body;
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
