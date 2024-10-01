import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email } = httpRequest.body;
    if (!name) {
      return {
        statusCode: 400,
        body: new Error("Missing param: name"),
      };
    }

    if (!email) {
      return {
        statusCode: 400,
        body: new Error("Missing param: email"),
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
