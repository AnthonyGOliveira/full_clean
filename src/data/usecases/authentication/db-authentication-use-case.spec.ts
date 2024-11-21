import { AccountTokenModel } from "../../models/account-token-model";
import { FindAcountModel } from "../../models/find-account-model";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";
import { PasswordValidator } from "../../protocols/password-validator";
import { TokenGenerator, TokenResponse } from "../../protocols/token-generator";
import { DbAuthenticationUseCase } from "./db-authentication-use-case";

interface TypeSut {
  sut: DbAuthenticationUseCase;
  repository: FindAccountByEmailRepository;
  passwordValidator: PasswordValidator;
  tokenGenerator: TokenGenerator;
}

const makeTokenGeneratorStub = (): TokenGenerator => {
  const token: TokenResponse = {
    accessToken: "any_access_token",
    expiresIn: "15m",
  };
  class TokenGeneratorStub implements TokenGenerator {
    generate(account: AccountTokenModel): TokenResponse {
      return token;
    }
  }

  return new TokenGeneratorStub();
};

const makeFindAccountByEmailRepositoryStub =
  (): FindAccountByEmailRepository => {
    const accountModel: FindAcountModel = {
      id: "123",
      name: "any_name",
      email: "any@email.com",
      password: "any_hash",
      role: "user"
    };
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
  const tokenGeneratorStub = makeTokenGeneratorStub();
  const sut = new DbAuthenticationUseCase(
    findAccountRepository,
    passwordValidatorStub,
    tokenGeneratorStub
  );
  return {
    sut,
    repository: findAccountRepository,
    passwordValidator: passwordValidatorStub,
    tokenGenerator: tokenGeneratorStub,
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
  test("should DbAuthenticationUseCase call PasswordValidator and return null", async () => {
    const { sut, passwordValidator } = makeSut();
    const spyRepository = jest
      .spyOn(passwordValidator, "compare")
      .mockResolvedValueOnce(false);
    const login = {
      email: "any@email.com",
      password: "any_password",
    };
    const expectHash = "any_hash";
    const result = await sut.execute(login);
    expect(spyRepository).toHaveBeenCalledWith(login.password, expectHash);
    expect(result).toBe(null);
  });
  test("should DbAuthenticationUseCase call TokenGenerator", async () => {
    const { sut, tokenGenerator } = makeSut();
    const spyTokenGenerator = jest.spyOn(tokenGenerator, "generate");
    const login = {
      email: "any@email.com",
      password: "any_password",
    };

    const accountModel: FindAcountModel = {
      id: "123",
      name: "any_name",
      email: "any@email.com",
      password: "any_hash",
      role: "user"
    };
    await sut.execute(login);
    expect(spyTokenGenerator).toHaveBeenCalledWith(accountModel);
  });
  test("should throws error in DbAuthenticationUseCase call", async () => {
    const { sut, repository } = makeSut();
    jest.spyOn(repository, "find").mockRejectedValueOnce(new Error());
    const login = {
      email: "any@email.com",
      password: "any_password",
    };
    const promise = sut.execute(login);
    await expect(promise).rejects.toThrow();
  });
  test("should return AuthResponse if DbAuthenticationUseCase called", async () => {
    const { sut } = makeSut();
    const login = {
      email: "any@email.com",
      password: "any_password",
    };
    const expectedResult = {
      accessToken: "any_access_token",
      expiresIn: "15m",
    };
    const result = await sut.execute(login);
    expect(result).toEqual(expectedResult);
  });
});
