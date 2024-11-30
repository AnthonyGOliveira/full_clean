import { serverError } from "../../helpers/http-helpers";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class UpdateAccountController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      throw new Error();
    } catch (error) {
      return serverError(error);
    }
  }
}
