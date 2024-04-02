import { app } from "src/app";
import request from "supertest";
import { CreateAndAuthenticateUserWithTokensFactory } from "test/factories/make-create-and-authenticate-user";

describe("Refresh Token (E2E)", () => {
  let createAndAuthenticateUserWithTokensFactory: CreateAndAuthenticateUserWithTokensFactory;

  beforeAll(async () => {
    await app.ready();

    createAndAuthenticateUserWithTokensFactory =
      new CreateAndAuthenticateUserWithTokensFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /auth/user/refresh-token", async () => {
    const { refreshToken } =
      await createAndAuthenticateUserWithTokensFactory.makePrismaCreateAndAuthenticateUserWithTokens(
        app,
      );

    const result = await request(app.server)
      .post("/auth/user/refresh-token")
      .send({ refreshId: refreshToken.id });

    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        newRefreshToken: null,
      }),
    );

    if (result.body.refreshToken) {
      expect(result.body.newRefreshToken.id).toEqual(expect.any(String));
      expect(result.body.newRefreshToken.expires).toEqual(expect.any(Number));
    }
  });
});
