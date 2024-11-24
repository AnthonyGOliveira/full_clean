import jwt from "jsonwebtoken";
import { JsonWebTokenVerifier } from "./jwt-token-verifier";
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn().mockReturnValue({
    sub: "any_id",
    email: "any_email",
    role: "any_role",
  }),
}));
const makeSut = () => {
  const sut = new JsonWebTokenVerifier();
  return {
    sut,
  };
};

describe("JsonWebTokenVerifier", () => {
  test("should throw an error if token is not valid", () => {
    const { sut } = makeSut();
    const token: string = "any_token";
    try {
      expect(sut.verify(token)).toThrow();
    } catch (error) {
      expect(jwt.verify).toHaveBeenCalledWith(token, "SECRET_KEY");
      expect(error).toBeInstanceOf(Error);
    }
  });
});
