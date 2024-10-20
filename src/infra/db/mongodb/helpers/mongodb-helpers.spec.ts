import { MongoMock } from "../helpers/mongodb-mocking";
import { MongoDatabaseHelper } from "../helpers/mongodb-helper";

jest.mock("mongodb", () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => MongoMock()),
  };
});

describe("MongoDatabaseHelper", () => {
  beforeEach(async () => {
    await MongoDatabaseHelper.connect(process.env.MONGO_URL);
  });

  afterEach(async () => {
    await MongoDatabaseHelper.disconnect();
  });

  test("should connect to the database", async () => {
    expect(MongoDatabaseHelper.client).toBeTruthy();
  });

  test("should disconnect from the database", async () => {
    await MongoDatabaseHelper.disconnect();
    expect(MongoDatabaseHelper.client).toBeNull();
  });

  test("should return a collection", async () => {
    const collectionName = "test_collection";
    const collection = await MongoDatabaseHelper.getCollection(collectionName);
    expect(collection).toBeTruthy();
    expect(collection.collectionName).toBe(collectionName);
  });

  test("should return a collection post disconnection", async () => {
    const collectionName = "test_collection";
    await MongoDatabaseHelper.disconnect();
    const collection = await MongoDatabaseHelper.getCollection(collectionName);
    expect(collection).toBeTruthy();
    expect(collection.collectionName).toBe(collectionName);
  });
});
