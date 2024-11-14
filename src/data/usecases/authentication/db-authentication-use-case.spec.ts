import { FindAcountModel } from "../../models/find-account-model";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";
import { DbAuthenticationUseCase } from "./db-authentication-use-case";

interface TypeSut {
  sut: DbAuthenticationUseCase;
  repository: FindAccountByEmailRepository;
}

const makeFindAccountByEmailRepositoryStub =
  (): FindAccountByEmailRepository => {
    class FindAccountByEmailRepositoryStub
      implements FindAccountByEmailRepository
    {
      async find(email: string): Promise<FindAcountModel> {
        return new Promise((resolve) => resolve(null));
      }
    }

    return new FindAccountByEmailRepositoryStub();
  };

const makeSut = (): TypeSut => {
  const findAccountRepository = makeFindAccountByEmailRepositoryStub();
  const sut = new DbAuthenticationUseCase(findAccountRepository);
  return {
    sut,
    repository: findAccountRepository,
  };
};

describe("DbAuthenticationUseCase", () => {
  test("should create a instance of DbAuthenticationUseCase", () => {
    const { sut } = makeSut();
    expect(sut).toBeInstanceOf(DbAuthenticationUseCase);
  });
  test("should DbAuthenticationUseCase call repository", async () => {
    const { sut, repository } = makeSut();
    const spyRepository = jest.spyOn(repository, "find");
    const login = {
      email: "any@email.com",
      password: "any_password",
    };
    await sut.execute(login);
    expect(spyRepository).toHaveBeenCalledWith(login.email);
  });
});
