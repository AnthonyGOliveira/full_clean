import { MissingParam } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helpers";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email } = httpRequest.body;
    if (!name) {
      return badRequest(new MissingParam("name"));
    }

    if (!email) {
      return badRequest(new MissingParam("email"));
    }

    return {
      statusCode: 200,
      body: {
        message: "Signup is successfull",
      },
    };
  }
}
