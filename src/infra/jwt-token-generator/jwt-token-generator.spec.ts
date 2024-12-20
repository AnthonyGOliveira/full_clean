import jwt from "jsonwebtoken";
import { JwtTokenGenerator } from "./jwt-token-generator";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("any_jwt_yoken"),
}));

const makeSut = () => {
  return {
    sut: new JwtTokenGenerator(),
  };
};

describe("JwtTokenGenerator", () => {
  test("should call correct method on JwtTokenGenerator", () => {
    const { sut } = makeSut();
    const account = {
      id: "any_id",
      name: "any_name",
      email: "any_email@email.com",
      role: "user"
    };
    const expectedPayload = {
      sub: "any_id",
      email: "any_email@email.com",
      role: "user"
    };
    const expecteSecretKey = "SECRET_KEY";
    const expectedOptions = { expiresIn: "15m" };
    const spyJwt = jest.spyOn(jwt, "sign");
    const jwtToken = "any_jwt_yoken";
    const result = sut.generate(account);
    expect(spyJwt).toHaveBeenCalledWith(
      expectedPayload,
      expecteSecretKey,
      expectedOptions
    );
    expect(result).toEqual({
      accessToken: jwtToken,
      expiresIn: "15m",
    });
  });
  test("should throw an error if method on JwtTokenGenerator generate error", () => {
    const { sut } = makeSut();
    const account = {
      id: "any_id",
      name: "any_name",
      email: "any_email@email.com",
      role: "user"
    };
    jest.spyOn(jwt, "sign").mockImplementation(() => {
      throw new Error();
    });
    expect(() => sut.generate(account)).toThrow();
  });
});
