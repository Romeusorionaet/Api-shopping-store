import { app } from "src/app";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import request from "supertest";
import { createAndAuthenticateUser } from "test/factories/make-create-and-authenticate-user";
import { UserAddressFactory } from "test/factories/make-user-address";

describe("Get user address (E2E)", () => {
  let userAddressFactory: UserAddressFactory;

  beforeAll(async () => {
    await app.ready();

    userAddressFactory = new UserAddressFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /user/create-user-address/:userId", async () => {
    const { accessToken, user } = await createAndAuthenticateUser(app);

    const userId = user.id;

    await userAddressFactory.makePrismaUserAddress({
      userId: new UniqueEntityID(userId),
      city: "Canguaretama",
    });

    const result = await request(app.server)
      .get(`/user/user-address/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(200);
    expect(result.body.userAddress).toEqual(
      expect.objectContaining({ city: "Canguaretama" }),
    );
  });
});
