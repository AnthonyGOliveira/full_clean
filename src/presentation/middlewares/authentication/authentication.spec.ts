import { HttpRequest } from "../../protocols/http";
import { AuthenticationMiddleware } from "./authentication";
import { forbidden, ok, serverError } from "../../helpers/http-helpers";
import { ForbiddenError } from "../../errors/forbidden-error";
import {
  AuthenticateTokenUseCase,
  AuthenticateTokenResponse,
} from "../../../domain/usecases/authenticate-token-use -case";

type SutType = {
  sut: AuthenticationMiddleware;
  usecase: AuthenticateTokenUseCase;
};

const makeAuthenticateTokenStub = () => {
  class AuthenticateTokenStub implements AuthenticateTokenUseCase {
    execute(token: string): AuthenticateTokenResponse | null {
      return {
        id: "any_id",
      };
    }
  }

  return new AuthenticateTokenStub();
};

const makeSut = (): SutType => {
  const useCaseStub = makeAuthenticateTokenStub();
  const sut = new AuthenticationMiddleware(useCaseStub);
  return {
    sut,
    usecase: useCaseStub,
  };
};

describe("AuthenticationMiddleware", () => {
  let token: string;
  let request: HttpRequest;
  beforeEach(() => {
    token = "any_token";
    request = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  });
  test("should return 403 forbidden if user is not authorized", async () => {
    const { sut, usecase } = makeSut();
    jest.spyOn(usecase, "execute").mockImplementation(() => null);
    const result = await sut.handle(request);
    expect(result).toEqual(forbidden(new ForbiddenError()));
  });
  test("should return 200 if user is authorized", async () => {
    const { sut, usecase } = makeSut();
    const spyUsecase = jest.spyOn(usecase, "execute");
    const result = await sut.handle(request);
    expect(spyUsecase).toHaveBeenCalledWith(token);
    expect(result).toEqual(
      ok({
        id: "any_id",
      })
    );
  });
  test("should return 200 if user is authorized and role is correct", async () => {
    const { sut, usecase } = makeSut();
    const spyUsecase = jest.spyOn(usecase, "execute");
    request.body = {
      role: "any_role",
    };
    const result = await sut.handle(request);
    expect(spyUsecase).toHaveBeenCalledWith(token, "any_role");
    expect(result).toEqual(
      ok({
        id: "any_id",
      })
    );
  });
  test("should return 500 if internal server error occurred in use case", async () => {
    const { sut, usecase } = makeSut();
    const error = new Error("any_error");
    jest.spyOn(usecase, "execute").mockImplementation(() => {
      throw error;
    });
    const result = await sut.handle(request);
    expect(result).toEqual(serverError(error));
  });
});
