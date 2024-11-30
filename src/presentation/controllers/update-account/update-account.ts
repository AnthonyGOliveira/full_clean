import { badRequest, serverError } from "../../helpers/http-helpers";
import { Validation } from "../../helpers/validators/validation";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class UpdateAccountController implements Controller {
  constructor(private readonly validation: Validation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }
      throw new Error();
    } catch (error) {
      return serverError(error);
    }
  }
}
