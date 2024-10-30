import { MissingParam } from "../../errors/missing-param-error";
import { badRequest } from "../../helpers/http-helpers";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class LoginController implements Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const validateFields = ["email", "password"];
    for (const field of validateFields) {
      if (!httpRequest.body[field]) {
        return new Promise((resolve) =>
          resolve(badRequest(new MissingParam(field)))
        );
      }
    }
  }
}
