import { MissingParam } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helpers";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
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
    return {
      statusCode: 200,
      body: {
        message: "Signup is successfull",
      },
    };
  }
}
