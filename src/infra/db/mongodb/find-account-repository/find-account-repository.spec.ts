import { MongoMock } from "../helpers/mongodb-mocking";
import { MongoDatabaseHelper } from "../helpers/mongodb-helper";
import { FindAccountByEmailMongoRepository } from "./find-account-repository";

jest.mock("mongodb", () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => MongoMock()),
  };
});

const account = {
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_hash_password",
};

describe("FindAccountByEmailMongoRepository", () => {
  beforeAll(async () => {
    await MongoDatabaseHelper.connect(process.env.MONGO_URL);
    const accountCollection = await MongoDatabaseHelper.getCollection(
      "accounts"
    );
    await accountCollection.insertOne(account);
  });
  afterAll(async () => {
    const accountCollection = await MongoDatabaseHelper.getCollection(
      "accounts"
    );
    await accountCollection.deleteMany({});
    await MongoDatabaseHelper.disconnect();
  });
  const makeSut = () => {
    const findAccountByEmailMongoRepositoryStub =
      new FindAccountByEmailMongoRepository();

    return {
      sut: findAccountByEmailMongoRepositoryStub,
    };
  };

  test("should return FindAcountModel in FindAccountByEmailMongoRepository", async () => {
    const { sut } = makeSut();
    const email = "any_email@mail.com";
    const result = await sut.find(email);
    expect(result).toBeTruthy();
    expect(result.name).toBe(account.name);
    expect(result.email).toBe(account.email);
    expect(result.password).toBe(account.password);
  });
});
