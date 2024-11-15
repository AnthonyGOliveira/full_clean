import { FindAcountModel } from "../../models/find-account-model";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";
import { PasswordValidator } from "../../protocols/password-validator";
import { DbAuthenticationUseCase } from "./db-authentication-use-case";

interface TypeSut {
  sut: DbAuthenticationUseCase;
  repository: FindAccountByEmailRepository;
  passwordValidator: PasswordValidator;
}

const makeFindAccountByEmailRepositoryStub =
  (): FindAccountByEmailRepository => {
    const accountModel: FindAcountModel = {
        id: "123",
        name: "any_name",
        email: "any@email.com",
        password: "any_hash"
    }
    class FindAccountByEmailRepositoryStub
      implements FindAccountByEmailRepository
    {
      async find(email: string): Promise<FindAcountModel> {
        return new Promise((resolve) => resolve(accountModel));
      }
    }

    return new FindAccountByEmailRepositoryStub();
  };

const makePasswordValidatorStub = (): PasswordValidator => {
  class PasswordValidatorStub implements PasswordValidator {
    async compare(password: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }

  return new PasswordValidatorStub();
};

const makeSut = (): TypeSut => {
  const findAccountRepository = makeFindAccountByEmailRepositoryStub();
  const passwordValidatorStub = makePasswordValidatorStub();
  const sut = new DbAuthenticationUseCase(
    findAccountRepository,
    passwordValidatorStub
  );
  return {
    sut,
    repository: findAccountRepository,
    passwordValidator: passwordValidatorStub,
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
  test("should DbAuthenticationUseCase return null if not find account", async () => {
    const { sut, repository } = makeSut();
    jest.spyOn(repository, "find").mockResolvedValueOnce(null);
    const login = {
      email: "any@email.com",
      password: "any_password",
    };
    const result = await sut.execute(login);
    expect(result).toEqual(null);
  });
  test("should DbAuthenticationUseCase call PasswordValidator", async () => {
    const { sut, passwordValidator } = makeSut();
    const spyRepository = jest.spyOn(passwordValidator, "compare");
    const login = {
      email: "any@email.com",
      password: "any_password",
    };
    const expectHash = "any_hash";
    await sut.execute(login);
    expect(spyRepository).toHaveBeenCalledWith(login.password, expectHash);
  });
});
