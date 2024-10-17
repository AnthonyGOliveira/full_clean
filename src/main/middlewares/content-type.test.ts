import request from "supertest";
import app from "../config/app";

describe("Default content type middleware", () => {
  test("should return default content type", async () => {
    const contentTypeDefault = "/test_content_type";
    app.post(contentTypeDefault, (req, res) => {
      res.send();
    });
    const bodyRequest = {
      test1: 1,
      test2: "test2",
    };
    await request(app)
      .post(contentTypeDefault)
      .send(bodyRequest)
      .expect("Content-Type", /json/);
  });
  test("should return different content type", async () => {
    const contentTypeDifferent = "/test_content_type_xml";
    app.post(contentTypeDifferent, (req, res) => {
      res.type("xml");
      res.send("");
    });
    const bodyRequest = {
      test1: 1,
      test2: "test2",
    };
    await request(app)
      .post(contentTypeDifferent)
      .send(bodyRequest)
      .expect("Content-Type", /xml/);
  });
});
