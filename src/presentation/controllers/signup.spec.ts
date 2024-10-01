import { MissingParam } from "../errors/missing-param-error";
import { SignUpController } from "./signup";

describe("SignUp Controller", () => {
  test("Should return 400 if name is not provided", async () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParam("name"));
  });
  test("Should return 400 if email is not provided", async () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParam("email"));
  });
  test("Should return 400 if password is not provided", async () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        confirmationPassword: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParam("password"));
  });
  test("Should return 400 if confirmationPassword is not provided", async () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParam("confirmationPassword"));
  });
});
