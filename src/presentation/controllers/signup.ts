import { AddAcountUseCase } from "../../domain/usecases/add-acount-use-case";
import { InvalidParam } from "../errors/invalid-param-error";
import { MissingParam } from "../errors/missing-param-error";
import { badRequest, ok, serverError } from "../helpers/http-helpers";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { Logger } from "../protocols/logger";

export class SignUpController implements Controller {
  emailValidator: EmailValidator;
  logger: Logger;
  addAcountUseCase: AddAcountUseCase;
  constructor(
    emailValidator: EmailValidator,
    logger: Logger,
    addAcountUseCase: AddAcountUseCase
  ) {
    this.emailValidator = emailValidator;
    this.logger = logger;
    this.addAcountUseCase = addAcountUseCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validateFields = [
        "name",
        "email",
        "password",
        "confirmationPassword",
      ];
      for (const field of validateFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParam(field));
        }
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
      this.logger.error(error);
      return serverError();
    }
  }
}
