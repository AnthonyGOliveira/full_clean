import { HttpRequest } from "../../protocols/http";
import { AuthenticationMiddleware } from "./authentication";
import { forbidden, ok } from "../../helpers/http-helpers";
import { ForbiddenError } from "../../errors/forbidden-error";

const makeSut = () => {
  const sut = new AuthenticationMiddleware();
  return {
    sut,
  };
};

describe("AuthenticationMiddleware", () => {
  test("should return 403 forbidden if user is not authorized", async () => {
    const { sut } = makeSut();
    const request: HttpRequest = {};
    const result = await sut.handle(request);
    expect(result).toEqual(forbidden(new ForbiddenError()));
  });
});
