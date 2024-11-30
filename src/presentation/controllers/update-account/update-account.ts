import { UpdateAccountUseCase } from "../../../domain/usecases/update-account-use-case";
import { InvalidRequest } from "../../errors/invalid-request";
import { badRequest, serverError } from "../../helpers/http-helpers";
import { Validation } from "../../helpers/validators/validation";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { UpdateAccountUseCaseMapper } from "../mappers/update-account";

export class UpdateAccountController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly mapper: UpdateAccountUseCaseMapper
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }
      const updateAccount = this.mapper.toUseCase(httpRequest.body);
      const result = await this.updateAccountUseCase.execute(updateAccount);
      if (!result) {
        return badRequest(new InvalidRequest());
      }
      throw new Error();
    } catch (error) {
      return serverError(error);
    }
  }
}
