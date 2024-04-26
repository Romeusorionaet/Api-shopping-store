import { app } from "src/app";

describe("Register With Google (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /auth/register/oauth-google", async () => {});
});
