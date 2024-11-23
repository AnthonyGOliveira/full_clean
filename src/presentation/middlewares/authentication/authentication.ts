import { ForbiddenError } from "../../errors/forbidden-error";
import { forbidden } from "../../helpers/http-helpers";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { Middleware } from "../../protocols/middleware";

export class AuthenticationMiddleware implements Middleware {
  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise((resolve, reject) =>
      resolve(forbidden(new ForbiddenError()))
    );
  }
}
