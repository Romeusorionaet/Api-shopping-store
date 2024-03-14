import { app } from "src/app";
import request from "supertest";
import { createAndAuthenticateUser } from "test/factories/make-create-and-authenticate-user";

describe("Profile (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /buyer/profile", async () => {
    const { accessToken } = await createAndAuthenticateUser(app);

    const result = await request(app.server)
      .get("/buyer/profile")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual({
      profile: expect.objectContaining({
        email: "romeusoaresdesouto@gmail.com",
      }),
    });
  });
});