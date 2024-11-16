import bcrypt from "bcrypt";
import { PasswordValidatorAdapter } from "./password-validator";

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

const makeSut = () => {
  return {
    sut: new PasswordValidatorAdapter(),
  };
};
describe("PasswordValidator", () => {
  test("should return true if PasswordValidator called with correct values", async () => {
    const { sut } = makeSut();
    const spyBcrypt = jest.spyOn(bcrypt, "compare");
    const password = "any_password";
    const hashed_password = "hashed_password";
    const result = await sut.compare(password, hashed_password);
    expect(spyBcrypt).toHaveBeenCalledWith(password, hashed_password);
    expect(result).toBe(true);
  });
  test("should return false if PasswordValidator called with incorrect values", async () => {
    const { sut } = makeSut();
    const spyBcrypt = jest
      .spyOn(bcrypt, "compare")
      .mockImplementation(() => false);
    const password = "any_password";
    const hashed_password = "hashed_password";
    const result = await sut.compare(password, hashed_password);
    expect(spyBcrypt).toHaveBeenCalledWith(password, hashed_password);
    expect(result).toBe(false);
  });
  test("should throw an error if PasswordValidator generate error", async () => {
    const { sut } = makeSut();
    const error = new Error();
    const spyBcrypt = jest.spyOn(bcrypt, "compare").mockImplementation(() => {
      throw error;
    });
    const password = "any_password";
    const hashed_password = "hashed_password";
    const promise = sut.compare(password, hashed_password);
    expect(spyBcrypt).toHaveBeenCalledWith(password, hashed_password);
    await expect(promise).rejects.toThrow();
  });
});
