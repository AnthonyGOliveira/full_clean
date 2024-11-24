import { AuthenticateTokenVerifierUseCase } from "./authenticate-token-verifier-use-case";
import { Logger } from "../../protocols/logger";
import {
  TokenVerifier,
  TokenVerifierResponse,
} from "../../protocols/token-verifier";

type SutTypes = {
  sut: AuthenticateTokenVerifierUseCase;
  verifier: TokenVerifier;
  logger: Logger;
};

const makeTokenVerifierStub = () => {
  class TokenVerifierStub implements TokenVerifier {
    verify(token: string): TokenVerifierResponse {
      return {
        id: "any_id",
        email: "any@mail.com",
        role: "any_role",
      };
    }
  }

  return new TokenVerifierStub();
};

const makeLoggerStub = () => {
  class LoggerStub implements Logger {
    debug(message: string, meta: any): void {
      return;
    }
  }
  return new LoggerStub();
};

const makeSut = (): SutTypes => {
  const verifier = makeTokenVerifierStub();
  const logger = makeLoggerStub();
  const sut = new AuthenticateTokenVerifierUseCase(verifier, logger);
  return {
    sut,
    verifier,
    logger,
  };
};

describe("AuthenticateTokenVerifierUseCase", () => {
  test("should return null if token is not valid", () => {
    const { sut, verifier } = makeSut();
    const token = "any_token";
    const error = new Error("any_error");
    jest.spyOn(verifier, "verify").mockImplementation(() => {
      throw error;
    });
    const result = sut.execute(token);
    expect(result).toBeNull();
  });
  test("should return null if role is not equal to role token", () => {
    const { sut } = makeSut();
    const token = "any_token";
    const role = "another_role";
    const result = sut.execute(token, role);
    expect(result).toBeNull();
  });
  test("should return null verifier dependency throw an error", () => {
    const { sut, verifier, logger } = makeSut();
    const token = "any_token";
    const error = new Error("any_error");
    const verifierSpy = jest
      .spyOn(verifier, "verify")
      .mockImplementation(() => {
        throw error;
      });
    const loggerSpy = jest.spyOn(logger, "debug");
    const result = sut.execute(token);
    expect(verifierSpy).toHaveBeenCalledWith(token);
    expect(loggerSpy).toHaveBeenCalledWith(
      "An error occurred in the token verification process",
      { error }
    );
    expect(result).toBeNull();
  });
  test("should return corret response if token is valid", () => {
    const { sut, verifier, logger } = makeSut();
    const token = "any_token";
    const verifierSpy = jest.spyOn(verifier, "verify");
    const loggerSpy = jest.spyOn(logger, "debug");
    const result = sut.execute(token);
    expect(verifierSpy).toHaveBeenCalledWith(token);
    expect(loggerSpy).not.toHaveBeenCalled();
    expect(result).toEqual({ id: "any_id" });
  });
});
