import { app } from "src/infra/app";
import request from "supertest";

describe("Register With OAuth (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /auth/register/oauth/callback", async () => {
    const response = await request(app.server)
      .post("/auth/register/oauth/callback")
      .send({
        username: "User test 01",
        email: "usertest01@gmail.com",
        picture: "http://faker_picture.com",
        emailVerified: true,
      });

    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });
});
