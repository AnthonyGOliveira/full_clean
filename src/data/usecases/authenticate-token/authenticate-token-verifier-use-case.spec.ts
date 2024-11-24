import { AuthenticateTokenVerifierUseCase } from "./authenticate-token-verifier-use-case";

const makeSut = () => {
  const sut = new AuthenticateTokenVerifierUseCase();
  return {
    sut,
  };
};

describe("AuthenticateTokenVerifierUseCase", () => {
  test("should return null if token is not valid", () => {
    const { sut } = makeSut();
    const token = "any_token";
    const result = sut.execute(token);
    expect(result).toBeNull();
  });
});
