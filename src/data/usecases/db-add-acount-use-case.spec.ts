import { resolve } from "path";
import { Encrypter } from "../protocols/encrypter";
import { DbAddAcountUseCase } from "./db-add-acount-use-case";

interface TypeSut {
  sut: DbAddAcountUseCase;
  encrypted: Encrypter;
}

const makeSut = (): TypeSut => {
  class EncrypterStub implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  const encryptedStub = new EncrypterStub();
  const sut = new DbAddAcountUseCase(encryptedStub);

  return {
    sut,
    encrypted: encryptedStub,
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
});
