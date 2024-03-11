import { app } from "src/app";
import request from "supertest";

describe("Authenticate (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to authenticate user", async () => {
    await request(app.server).post("/user/register").send({
      username: "romeu soares",
      email: "romeu@gmail.com",
      password: "123456",
    });

    const result = await request(app.server)
      .post("/user/authenticate")
      .send({ email: "romeu@gmail.com", password: "123456" });

    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual({
      accessToken: expect.any(String),
    });
  });
});
