import request from "supertest";
import app from "../config/app";
import { MongoDatabaseHelper } from "../../infra/db/mongodb/helpers/mongodb-helper";
import { MongoMock } from "../../infra/db/mongodb/helpers/mongodb-mocking";

jest.mock("mongodb", () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => MongoMock()),
  };
});

describe("Signup Router", () => {
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
  const bodyParserUrl = "/test_body_parser";
  test("should handle json in request", async () => {
    app.post(bodyParserUrl, (req, res) => {
      res.send(req.body);
    });
    const bodyRequest = {
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
      confirmationPassword: "any_password",
    };
    const result = await request(app).post("/api/signup").send(bodyRequest);
    expect(result.status).toBe(200);
    expect(result.body.id).toBeTruthy();
    expect(result.body.password).toBeTruthy();
    expect(result.body.name).toBe(bodyRequest.name);
    expect(result.body.email).toBe(bodyRequest.email);
  });
});
