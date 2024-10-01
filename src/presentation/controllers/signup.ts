import { MissingParam } from "../errors/missing-param-error";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email } = httpRequest.body;
    if (!name) {
      return {
        statusCode: 400,
        body: new MissingParam("name"),
      };
    }

    if (!email) {
      return {
        statusCode: 400,
        body: new MissingParam("email"),
      };
    }

    return {
      statusCode: 200,
      body: {
        message: "Signup is successfull",
      },
    };
  }
}
