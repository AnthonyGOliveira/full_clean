import { FindAcountModel } from "../../models/find-account-model";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";
import { DbUpdateAcountUseCase } from "./update-account";

interface TypeSut {
  sut: DbUpdateAcountUseCase;
  findAccountRepository: FindAccountByEmailRepository;
}

const makeFindAccountByEmailRepositoryStub =
  (): FindAccountByEmailRepository => {
    const accountModel: FindAcountModel = {
      id: "123",
      name: "any_name",
      email: "any@email.com",
      password: "any_hash",
      role: "user",
    };
    class FindAccountByEmailRepositoryStub
      implements FindAccountByEmailRepository
    {
      async find(email: string): Promise<FindAcountModel> {
        return new Promise((resolve) => resolve(accountModel));
      }
    }

    return new FindAccountByEmailRepositoryStub();
  };

const makeSut = (): TypeSut => {
  const findAccountRepository = makeFindAccountByEmailRepositoryStub();
  const sut = new DbUpdateAcountUseCase(findAccountRepository);

  return {
    sut,
    findAccountRepository,
  };
};

describe("DbUpdateAcountUseCase", () => {
  const updateAccount = {
    id: "any_id",
    role: "any_role",
    name: "any_name",
    email: "any_email",
    oldPassword: "old_password",
    password: "any_password",
    confirmationPassword: "any_password",
  };
  test("should create a instance of DbUpdateAcountUseCase", () => {
    const { sut } = makeSut();
    expect(sut).toBeInstanceOf(DbUpdateAcountUseCase);
  });
  test("should DbUpdateAcountUseCase call repository", async () => {
    const { sut, findAccountRepository } = makeSut();
    const spyRepository = jest.spyOn(findAccountRepository, "find");
    await sut.execute(updateAccount);
    expect(spyRepository).toHaveBeenCalledWith(updateAccount.email);
  });
});
