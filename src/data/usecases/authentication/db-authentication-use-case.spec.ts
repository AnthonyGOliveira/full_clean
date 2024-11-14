import { DbAuthenticationUseCase } from "./db-authentication-use-case";

interface TypeSut {
  sut: DbAuthenticationUseCase;
}

const makeSut = (): TypeSut => {
  const sut = new DbAuthenticationUseCase();
  return {
    sut,
  };
};

describe("DbAuthenticationUseCase", () => {
  test("should create a instance of DbAuthenticationUseCase", () => {
    const { sut } = makeSut();
    expect(sut).toBeInstanceOf(DbAuthenticationUseCase);
  });
});
