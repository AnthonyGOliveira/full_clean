import { InvalidParam } from "../errors/invalid-param-error";
import { MissingParam } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helpers";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController implements Controller {
  emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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
    return {
      statusCode: 200,
      body: {
        message: "Signup is successfull",
      },
    };
  }
}
