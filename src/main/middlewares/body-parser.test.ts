import request from "supertest";
import app from "../config/app";

describe("BodyParser middleware", () => {
  const bodyParserUrl = "/test_body_parser";
  test("should handle json in request", async () => {
    app.post(bodyParserUrl, (req, res) => {
      res.send(req.body);
    });
    const bodyRequest = {
      test1: 1,
      test2: "test2",
    };
    const result = await request(app).post(bodyParserUrl).send(bodyRequest);
    expect(result.body).toEqual(bodyRequest);
  });
});
