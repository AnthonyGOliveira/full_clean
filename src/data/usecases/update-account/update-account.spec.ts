import { FindAcountModel } from "../../models/find-account-model";
import { Encrypter } from "../../protocols/encrypter";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";
import { PasswordValidator } from "../../protocols/password-validator";
import { DbUpdateAcountUseCase } from "./update-account";
import {
  UpdateAccount,
  UpdateAccountRepository,
} from "../../protocols/update-account-repository";
import { UpdateAccountModel } from "../../models/update-account-model";
import { Role } from "../../models/role-model";

interface TypeSut {
  sut: DbUpdateAcountUseCase;
  findAccountRepository: FindAccountByEmailRepository;
  passwordValidator: PasswordValidator;
  encrypted: Encrypter;
  updateAccountRepository: UpdateAccountRepository;
}

const makeEncrypterStub = () => {
  class EncrypterStub implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }

  return new EncrypterStub();
};

const makeUpdateAccountRepositoryStub = () => {
  class UpdateAccountRepositoryStub implements UpdateAccountRepository {
    async update(updateAccount: UpdateAccount): Promise<UpdateAccountModel> {
      return {
        id: "any_id",
        name: "any_name",
        email: "any@email.com",
        role: Role.USER,
      };
    }
  }

  return new UpdateAccountRepositoryStub();
};

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
  const encrypted = makeEncrypterStub();
  const updateAccountRepository = makeUpdateAccountRepositoryStub();
  const sut = new DbUpdateAcountUseCase(
    findAccountRepository,
    passwordValidatorStub,
    encrypted,
    updateAccountRepository
  );

  return {
    sut,
    findAccountRepository,
    passwordValidator: passwordValidatorStub,
    encrypted,
    updateAccountRepository,
  };
};

describe("DbUpdateAcountUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const updateAccount = {
    id: "any_id",
    role: "user",
    name: "any_name",
    email: "any@email.com",
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
  test("should DbAuthenticationUseCase call PasswordValidator and return null", async () => {
    const { sut, passwordValidator } = makeSut();
    const spyRepository = jest
      .spyOn(passwordValidator, "compare")
      .mockResolvedValueOnce(false);
    const expectHash = "any_hash";
    const result = await sut.execute(updateAccount);
    expect(spyRepository).toHaveBeenCalledWith(
      updateAccount.oldPassword,
      expectHash
    );
    expect(result).toBe(null);
  });
  test("should DbAuthenticationUseCase call encrypter", async () => {
    const { sut, encrypted } = makeSut();
    const spyEncrypted = jest.spyOn(encrypted, "encrypt");
    await sut.execute(updateAccount);
    expect(spyEncrypted).toHaveBeenCalledWith(updateAccount.password);
  });
  test("should DbAuthenticationUseCase call UpdateAccountRepository with password in entry value", async () => {
    const { sut, updateAccountRepository } = makeSut();
    const spyRepository = jest.spyOn(updateAccountRepository, "update");
    const accountUpdate = {
      id: "123",
      name: "any_name",
      email: "any@email.com",
      role: Role.USER,
      password: "hashed_password",
    };
    await sut.execute(updateAccount);
    expect(spyRepository).toHaveBeenCalledWith(accountUpdate);
  });
});
