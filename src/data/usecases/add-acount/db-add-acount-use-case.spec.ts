import { Encrypter } from "../../protocols/encrypter";
import { DbAddAcountUseCase } from "./db-add-acount-use-case";
import {
  AddAcount,
  AddAcountRepository,
} from "../../protocols/add-acount-repository";
import { AddAcountModel } from "../../models/add-acount-model";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";
import { FindAcountModel } from "../../models/find-account-model";

interface TypeSut {
  sut: DbAddAcountUseCase;
  encrypted: Encrypter;
  repository: AddAcountRepository;
  findAccount: FindAccountByEmailRepository;
}

const makeFindAccountByEmailRepositoryStub =
  (): FindAccountByEmailRepository => {
    class FindAccountByEmailRepositoryStub
      implements FindAccountByEmailRepository
    {
      async find(email: string): Promise<FindAcountModel | null> {
        return new Promise((resolve) => resolve(null));
      }
    }

    return new FindAccountByEmailRepositoryStub();
  };

const makeSut = (): TypeSut => {
  class EncrypterStub implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  class AddAcountRepositoryStub implements AddAcountRepository {
    async add(addAcount: AddAcount): Promise<AddAcountModel> {
      const addAcountModel = {
        id: "valid_id",
        name: addAcount.name,
        email: addAcount.email,
        password: addAcount.password,
      };
      return new Promise((resolve) => resolve(addAcountModel));
    }
  }
  const encryptedStub = new EncrypterStub();
  const addAcountRepository = new AddAcountRepositoryStub();
  const findAccountRepository = makeFindAccountByEmailRepositoryStub();
  const sut = new DbAddAcountUseCase(
    encryptedStub,
    addAcountRepository,
    findAccountRepository
  );

  return {
    sut,
    encrypted: encryptedStub,
    repository: addAcountRepository,
    findAccount: findAccountRepository,
  };
};

describe("DbAddAcountUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  test("should DbAddAccountUseCase call encrypter", async () => {
    const { sut, encrypted } = makeSut();
    const addAcount = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const spyEncrypted = jest.spyOn(encrypted, "encrypt");
    await sut.execute(addAcount);
    expect(spyEncrypted).toHaveBeenCalledWith(addAcount.password);
  });
  test("should return AddAcountModel in DbAddAccountUseCase call", async () => {
    const { sut, encrypted } = makeSut();
    const addAcount = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const expectedResponse = {
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password",
    };
    const spyEncrypted = jest.spyOn(encrypted, "encrypt");
    const result = await sut.execute(addAcount);
    expect(spyEncrypted).toHaveBeenCalledWith(addAcount.password);
    expect(result).toEqual(expectedResponse);
  });
  test("should throws error in DbAddAccountUseCase call", async () => {
    const { sut, encrypted } = makeSut();
    const addAcount = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const spyEncrypted = jest
      .spyOn(encrypted, "encrypt")
      .mockImplementation(
        () => new Promise((resolve, rejects) => rejects(new Error()))
      );
    try {
      expect(await sut.execute(addAcount)).toThrow();
    } catch (error) {
      expect(spyEncrypted).toHaveBeenCalledWith(addAcount.password);
    }
  });
  test("should DbAddAccountUseCase call AddAcountRepository", async () => {
    const { sut, repository } = makeSut();
    const addAcount = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password",
      role: "user",
    };
    const spyRepository = jest.spyOn(repository, "add");
    await sut.execute(addAcount);
    expect(spyRepository).toHaveBeenCalledWith(addAcount);
  });
  test("should throws error in DbAddAccountUseCase call and email already exists", async () => {
    const { sut, findAccount } = makeSut();
    const addAcount = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const accountModel: FindAcountModel = {
      id: "123",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
      role: "user"
    };
    const spyFindAccount = jest
      .spyOn(findAccount, "find")
      .mockResolvedValue(accountModel);
    try {
      expect(await sut.execute(addAcount)).toThrow();
    } catch (error) {
      expect(spyFindAccount).toHaveBeenCalledWith(addAcount.email);
      expect(error.message).toBe("Email already registered");
    }
  });
});
