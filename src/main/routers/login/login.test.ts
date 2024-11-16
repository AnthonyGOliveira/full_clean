import request from "supertest";
import app from "../../config/app";
import { MongoDatabaseHelper } from "../../../infra/db/mongodb/helpers/mongodb-helper";
import { MongoMock } from "../../../infra/db/mongodb/helpers/mongodb-mocking";

const account = {
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_hash_password",
};

jest.mock("mongodb", () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => MongoMock()),
  };
});

describe("Login Router", () => {
  beforeAll(async () => {
    await MongoDatabaseHelper.connect(process.env.MONGO_URL);
    const bodyRequest = {
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
      confirmationPassword: "any_password",
    };
    await request(app).post("/api/signup").send(bodyRequest);
  });
  afterAll(async () => {
    const accountCollection = await MongoDatabaseHelper.getCollection(
      "accounts"
    );
    await accountCollection.deleteMany({});
    await MongoDatabaseHelper.disconnect();
  });
  test("should return 200 with accessToken in request", async () => {
    const bodyRequest = {
      email: "any_email@mail.com",
      password: "any_password",
    };
    const result = await request(app).post("/api/login").send(bodyRequest);
    expect(result.status).toBe(200);
    expect(result.body.accessToken).toBeTruthy();
    expect(result.body.expiresIn).toBeTruthy();
  });
  test("should return 401 with unauthorized request", async () => {
    const bodyRequest = {
      email: "any_email@mail.com",
      password: "other_password",
    };
    const result = await request(app).post("/api/login").send(bodyRequest);
    expect(result.status).toBe(401);
    expect(result.body).toEqual("Unauthorized access");
  });
  test("should return 400 with bad request without email", async () => {
    const bodyRequest = {
      password: "other_password",
    };
    const result = await request(app).post("/api/login").send(bodyRequest);
    expect(result.status).toBe(400);
    expect(result.body).toEqual("Missing param: email");
  });
  test("should return 400 with bad request without password", async () => {
    const bodyRequest = {
      email: "any_email@mail.com",
    };
    const result = await request(app).post("/api/login").send(bodyRequest);
    expect(result.status).toBe(400);
    expect(result.body).toEqual("Missing param: password");
  });
  test("should return 400 with bad request without correct email", async () => {
    const bodyRequest = {
      email: "not_email_valid",
      password: "other_password",
    };
    const result = await request(app).post("/api/login").send(bodyRequest);
    expect(result.status).toBe(400);
    expect(result.body).toEqual("Invalid param: email");
  });
});
