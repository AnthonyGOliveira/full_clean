import { MongoMock } from "../helpers/mongodb-mocking";
import { MongoDatabaseHelper } from "../helpers/mongodb-helper";
import { AccountMongoRepository } from "./account";

jest.mock("mongodb", () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => MongoMock()),
  };
});

describe("AccountMongoRepository", () => {
  beforeAll(async () => {
    await MongoDatabaseHelper.connect(process.env.MONGO_URL);
  });
  afterEach(async () => {
    const accountCollection = MongoDatabaseHelper.getCollection("accounts");
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
    };
    const addAcountModel = await sut.add(addAcount);
    expect(addAcountModel).toBeTruthy();
    expect(addAcountModel.id).toBeTruthy();
    expect(addAcountModel.name).toBe(addAcount.name);
    expect(addAcountModel.email).toBe(addAcount.email);
    expect(addAcountModel.password).toBe(addAcount.password);
  });
});
