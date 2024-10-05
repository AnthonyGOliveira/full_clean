import { InvalidParam } from "../errors/invalid-param-error";
import { MissingParam } from "../errors/missing-param-error";
import { badRequest, serverError } from "../helpers/http-helpers";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { Logger } from "../protocols/logger";

export class SignUpController implements Controller {
  emailValidator: EmailValidator;
  logger: Logger;
  constructor(emailValidator: EmailValidator, logger: Logger) {
    this.emailValidator = emailValidator;
    this.logger = logger;
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
      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParam("email"));
      }

      if (
        httpRequest.body["password"] != httpRequest.body["confirmationPassword"]
      ) {
        return badRequest(new InvalidParam("confirmationPassword"));
      }
      return {
        statusCode: 200,
        body: {
          message: "Signup is successfull",
        },
      };
    } catch (error) {
      this.logger.error(error);
      return serverError();
    }
  }
}
