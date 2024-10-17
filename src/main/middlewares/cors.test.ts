import request from "supertest";
import app from "../config/app";

describe("Cors middleware", () => {
  const corsUrl = "/test_cors";
  test("should correct config cors", async () => {
    app.get(corsUrl, (req, res) => {
      res.send(req.body);
    });
    const response = await request(app).get(corsUrl);

    // Verifica se o cabeçalho CORS está configurado corretamente
    expect(response.headers["access-control-allow-origin"]).toEqual("*");
    expect(response.headers["access-control-allow-headers"]).toEqual("*");
    expect(response.headers["access-control-allow-methods"]).toEqual("*");
  });
});
