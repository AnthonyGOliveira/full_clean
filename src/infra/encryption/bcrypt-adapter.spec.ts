import bcrypt from "bcrypt";
import { BCryptAdapter } from "./bcrypt-adapter";
jest.mock("bcrypt", () => ({
  hash(data: string | Buffer, saltOrRounds: string | number): Promise<string> {
    return new Promise((resolve) => resolve("hash_password"));
  },
}));
describe("BCryptAdapter", () => {
  test("should call correct method on BCryptAdapter", async () => {
    const sut = new BCryptAdapter();
    const spyBcrypt = jest.spyOn(bcrypt, "hash");
    const password = "valid_password";
    const salt = 12;
    await sut.encrypt(password);
    expect(spyBcrypt).toHaveBeenCalledWith(password, salt);
  });
  test("should call correct method on BCryptAdapter with another salt", async () => {
    const salt = 8;
    const sut = new BCryptAdapter(salt);
    const spyBcrypt = jest.spyOn(bcrypt, "hash");
    const password = "valid_password";
    await sut.encrypt(password);
    expect(spyBcrypt).toHaveBeenCalledWith(password, salt);
  });
  test("should return correct value in BCryptAdapter", async () => {
    const salt = 8;
    const sut = new BCryptAdapter(salt);
    const spyBcrypt = jest.spyOn(bcrypt, "hash");
    const password = "valid_password";
    const expectedResult = "hash_password";
    const promise = sut.encrypt(password);
    expect(spyBcrypt).toHaveBeenCalledWith(password, salt);
    await expect(promise).resolves.toEqual(expectedResult);
  });
  test("should BCryptAdapter throw error", async () => {
    const salt = 8;
    const sut = new BCryptAdapter(salt);
    const spyBcrypt = jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(() => Promise.reject(new Error("Error")));
    const password = "valid_password";
    const expectedResult = "hash_password";
    const promise = sut.encrypt(password);
    expect(spyBcrypt).toHaveBeenCalledWith(password, salt);
    await expect(promise).rejects.toThrow();
  });
});
