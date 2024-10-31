import { MissingParam } from "../../errors/missing-param-error";
import { badRequest, serverError, ok } from "../../helpers/http-helpers";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { FindAccountUseCase } from "../../../domain/usecases/find-account-use-case";

export class LoginController implements Controller {
  private readonly findAccountUseCase: FindAccountUseCase;
  constructor(findAccountUseCase: FindAccountUseCase) {
    this.findAccountUseCase = findAccountUseCase;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validateFields = ["email", "password"];
      for (const field of validateFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParam(field));
        }
      }
      const { email, password } = httpRequest.body;
      const result = await this.findAccountUseCase.execute({ email, password });
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
