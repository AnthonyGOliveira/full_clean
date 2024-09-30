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
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  });
});
