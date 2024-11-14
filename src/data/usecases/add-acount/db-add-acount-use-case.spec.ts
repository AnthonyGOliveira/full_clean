import { Encrypter } from "../../protocols/encrypter";
import { DbAddAcountUseCase } from "./db-add-acount-use-case";
import {
  AddAcount,
  AddAcountRepository,
} from "../../protocols/add-acount-repository";
import { AddAcountModel } from "../../models/add-acount-model";

interface TypeSut {
  sut: DbAddAcountUseCase;
  encrypted: Encrypter;
  repository: AddAcountRepository;
}

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
  const sut = new DbAddAcountUseCase(encryptedStub, addAcountRepository);

  return {
    sut,
    encrypted: encryptedStub,
    repository: addAcountRepository,
  };
};

describe("DbAddAcountUseCase", () => {
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
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.execute(addAcount);
    expect(spyEncrypted).toHaveBeenCalledWith(addAcount.password);
    await expect(promise).rejects.toThrow();
  });
  test("should DbAddAccountUseCase call AddAcountRepository", async () => {
    const { sut, repository } = makeSut();
    const addAcount = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password",
    };
    const spyRepository = jest.spyOn(repository, "add");
    await sut.execute(addAcount);
    expect(spyRepository).toHaveBeenCalledWith(addAcount);
  });
});
