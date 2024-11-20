import { AddAcountUseCase } from "../../../domain/usecases/add-acount-use-case";
import { ConflictError } from "../../errors/conflict-error";
import {
  badRequest,
  conflict,
  ok,
  serverError,
} from "../../helpers/http-helpers";
import { Validation } from "../../helpers/validators/validation";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class SignUpController implements Controller {
  addAcountUseCase: AddAcountUseCase;
  validation: Validation;
  constructor(addAcountUseCase: AddAcountUseCase, validation: Validation) {
    this.addAcountUseCase = addAcountUseCase;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }
      const { email, password, name } = httpRequest.body;
      const addAcount = {
        name: name,
        email: email,
        password: password,
      };
      const result = await this.addAcountUseCase.execute(addAcount);

      return ok(result);
    } catch (error) {
      if (error.message === "Email already registered") {
        return conflict(new ConflictError(error.message));
      }
      return serverError(error);
    }
  }
}
