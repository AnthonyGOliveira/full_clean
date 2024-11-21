import { MongoMock } from "../helpers/mongodb-mocking";
import { MongoDatabaseHelper } from "../helpers/mongodb-helper";
import { AccountMongoRepository } from "./account";
import { config } from "../../../../main/config/config";

jest.mock("mongodb", () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => MongoMock()),
  };
});

describe("AccountMongoRepository", () => {
  beforeAll(async () => {
    await MongoDatabaseHelper.connect(config.database.url);
  });
  afterEach(async () => {
    const accountCollection = await MongoDatabaseHelper.getCollection(
      "accounts"
    );
    await accountCollection.deleteMany({});
  });
  afterAll(async () => {
    await MongoDatabaseHelper.disconnect();
  });
  const makeSut = () => {
    const accountMongoRepositoryStub = new AccountMongoRepository();
    return {
      sut: accountMongoRepositoryStub,
    };
  };
  test("should return AddAcountModel in AccountMongoRepository", async () => {
    const { sut } = makeSut();
    const addAcount = {
      name: "any_name",
      email: "any_email@email.com",
      password: "hashed_password",
      role: "user",
    };
    const addAcountModel = await sut.add(addAcount);
    expect(addAcountModel).toBeTruthy();
    expect(addAcountModel.id).toBeTruthy();
    expect(addAcountModel.name).toBe(addAcount.name);
    expect(addAcountModel.email).toBe(addAcount.email);
  });
  test("should throw an error if add throws", async () => {
    const { sut } = makeSut();
    const error = new Error("Database error");
    jest
      .spyOn(MongoDatabaseHelper, "getCollection")
      .mockImplementationOnce(() => {
        throw error;
      });
    const addAcount = {
      name: "any_name",
      email: "any_email@email.com",
      password: "hashed_password",
      role: "user",
    };
    await expect(sut.add(addAcount)).rejects.toThrow("Database error");
  });
});
