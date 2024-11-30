import { MongoMock } from "../helpers/mongodb-mocking";
import { UpdateAccountMongoRepositoryRepository } from "./update-account-repository";
import { MongoDatabaseHelper } from "../helpers/mongodb-helper";
import { config } from "../../../../main/config/config";
import { Role } from "../../../../data/protocols/update-account-repository";
jest.mock("mongodb", () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => MongoMock()),
    ObjectId: jest.fn().mockImplementation((id) => ({ toString: () => id })),
  };
});

const updateAcount = {
  id: "123",
  name: "any_name",
  email: "any_email@email.com",
  password: "hashed_password",
  role: Role.USER,
};

describe("UpdateAccountMongoRepositoryRepository", () => {
  beforeAll(async () => {
    await MongoDatabaseHelper.connect(config.database.url);
    const accountCollection = await MongoDatabaseHelper.getCollection(
      "accounts"
    );
    await accountCollection.insertOne(updateAcount);
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
    const UpdateAccountMongoRepositoryRepositoryStub =
      new UpdateAccountMongoRepositoryRepository();

    return {
      sut: UpdateAccountMongoRepositoryRepositoryStub,
    };
  };
  test("should return updateAcountModel in AccountMongoRepository", async () => {
    const { sut } = makeSut();
    const alterating_name = "another_name";
    const updateAcountModel = await sut.update({
      ...updateAcount,
      name: alterating_name,
    });
    expect(updateAcountModel).toBeTruthy();
    expect(updateAcountModel.id).toBeTruthy();
    expect(updateAcountModel.name).toBe(alterating_name);
    expect(updateAcountModel.email).toBe(updateAcount.email);
    expect(updateAcountModel.role).toBe(updateAcount.role);
  });
  test("should return updateAcountModel in AccountMongoRepository without password sending", async () => {
    const { sut } = makeSut();
    const alterating_name = "another_name";
    const spySut = jest.spyOn(sut, "update");
    const data = {
      ...updateAcount,
      name: alterating_name,
      password: undefined,
    };
    const updateAcountModel = await sut.update(data);
    expect(updateAcountModel).toBeTruthy();
    expect(updateAcountModel.id).toBeTruthy();
    expect(updateAcountModel.name).toBe(alterating_name);
    expect(updateAcountModel.email).toBe(updateAcount.email);
    expect(updateAcountModel.role).toBe(updateAcount.role);
    expect(spySut).toHaveBeenCalledWith(data);
  });
  test("should throw an error if add throws", async () => {
    const { sut } = makeSut();
    const error = new Error("Database error");
    jest
      .spyOn(MongoDatabaseHelper, "getCollection")
      .mockImplementationOnce(() => {
        throw error;
      });
    await expect(sut.update(updateAcount)).rejects.toThrow("Database error");
  });
});
