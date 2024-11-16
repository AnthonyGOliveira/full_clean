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
});
