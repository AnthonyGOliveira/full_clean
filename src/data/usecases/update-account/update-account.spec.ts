import { FindAcountModel } from "../../models/find-account-model";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";
import { PasswordValidator } from "../../protocols/password-validator";
import { DbUpdateAcountUseCase } from "./update-account";

interface TypeSut {
  sut: DbUpdateAcountUseCase;
  findAccountRepository: FindAccountByEmailRepository;
  passwordValidator: PasswordValidator;
}

const makeFindAccountByEmailRepositoryStub =
  (): FindAccountByEmailRepository => {
    const accountModel: FindAcountModel = {
      id: "123",
      name: "any_name",
      email: "any@email.com",
      password: "any_hash",
      role: "user",
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
  const sut = new DbUpdateAcountUseCase(
    findAccountRepository,
    passwordValidatorStub
  );

  return {
    sut,
    findAccountRepository,
    passwordValidator: passwordValidatorStub,
  };
};

describe("DbUpdateAcountUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const updateAccount = {
    id: "any_id",
    role: "any_role",
    name: "any_name",
    email: "any_email",
    oldPassword: "old_password",
    password: "any_password",
    confirmationPassword: "any_password",
  };
  test("should create a instance of DbUpdateAcountUseCase", () => {
    const { sut } = makeSut();
    expect(sut).toBeInstanceOf(DbUpdateAcountUseCase);
  });
  test("should DbUpdateAcountUseCase call repository", async () => {
    const { sut, findAccountRepository } = makeSut();
    const spyRepository = jest.spyOn(findAccountRepository, "find");
    await sut.execute(updateAccount);
    expect(spyRepository).toHaveBeenCalledWith(updateAccount.email);
  });
  test("should DbUpdateAcountUseCase return null if not find account", async () => {
    const { sut, findAccountRepository } = makeSut();
    jest.spyOn(findAccountRepository, "find").mockResolvedValueOnce(null);
    const result = await sut.execute(updateAccount);
    expect(result).toEqual(null);
  });
  test("should DbAuthenticationUseCase call PasswordValidator", async () => {
    const { sut, passwordValidator } = makeSut();
    const spyRepository = jest.spyOn(passwordValidator, "compare");
    const expectHash = "any_hash";
    await sut.execute(updateAccount);
    expect(spyRepository).toHaveBeenCalledWith(
      updateAccount.oldPassword,
      expectHash
    );
  });
  test("should DbAuthenticationUseCase not call PasswordValidator", async () => {
    const { sut, passwordValidator } = makeSut();
    const spyRepository = jest.spyOn(passwordValidator, "compare");
    await sut.execute({
      ...updateAccount,
      oldPassword: undefined,
      password: undefined,
      confirmationPassword: undefined,
    });
    expect(spyRepository).not.toHaveBeenCalled();
  });
});
