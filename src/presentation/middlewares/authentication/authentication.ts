import { AuthenticateTokenUseCase } from "../../../domain/usecases/authenticate-token-use -case";
import { ForbiddenError } from "../../errors/forbidden-error";
import { forbidden, ok, serverError } from "../../helpers/http-helpers";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { Middleware } from "../../protocols/middleware";

export class AuthenticationMiddleware implements Middleware {
  constructor(
    private readonly authenticateTokenUseCase: AuthenticateTokenUseCase
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { headers } = httpRequest;
      const token = this.getTokenFromHeaders(headers);
      const tokenResponse = this.authenticateTokenUseCase.execute(token);
      if (!tokenResponse) {
        return forbidden(new ForbiddenError());
      }
      return ok(tokenResponse);
    } catch (error) {
      return serverError(error);
    }
  }
  private getTokenFromHeaders(headers: any): string {
    return headers.Authorization.split(" ")[1];
  }
}
