import { serverError } from "../../helpers/http-helpers";
import { UpdateAccountController } from "./update-account";

type SutType = {
  sut: UpdateAccountController;
};

const makeSut = (): SutType => {
  const sut = new UpdateAccountController();
  return {
    sut,
  };
};

describe("UpdateAccountController", () => {
  test("should return 500 if internal server error occurred in updateAcountController", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        role: "any_role",
        name: "any_name",
        email: "any_email",
        old_password: "old_password",
        password: "any_password",
        confirmationPassword: "any_password",
      },
    };
    const spyController = jest.spyOn(sut, "handle");
    const httpResponse = await sut.handle(httpRequest);
    expect(spyController).toHaveBeenCalledWith(httpRequest);
    expect(httpResponse.body.message).toEqual("Internal Server Error");
    expect(httpResponse.body.stack).toBeTruthy();
    expect(httpResponse.statusCode).toBe(500);
  });
});
