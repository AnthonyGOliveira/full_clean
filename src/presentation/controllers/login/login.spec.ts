import { MissingParam } from "../../errors/missing-param-error";
import { LoginController } from "./login";

interface typeSut {
  sut: LoginController;
}

const makeSut = (): typeSut => {
  const loginController = new LoginController();
  return {
    sut: loginController,
  };
};

describe("LoginController", () => {
  test("Should return 400 if request if not send email", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParam("email"));
  });
});
