import { hash } from "bcryptjs";
import { app } from "src/app";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Authenticate (E2E)", () => {
  let userFactory: UserFactory;

  beforeAll(async () => {
    await app.ready();

    userFactory = new UserFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /auth/user/authenticate", async () => {
    await userFactory.makePrismaUser({
      email: "romeu@gmail.com",
      password: await hash("123456", 8),
    });

    const result = await request(app.server)
      .post("/auth/user/authenticate")
      .send({ email: "romeu@gmail.com", password: "123456" });

    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });
});
