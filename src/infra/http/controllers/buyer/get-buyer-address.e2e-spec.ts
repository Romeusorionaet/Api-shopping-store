import { app } from "src/app";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import request from "supertest";
import { BuyerAddressFactory } from "test/factories/make-buyer-address";
import { createAndAuthenticateUser } from "test/factories/make-create-and-authenticate-user";

describe("Get buyer address (E2E)", () => {
  let buyerAddressFactory: BuyerAddressFactory;

  beforeAll(async () => {
    await app.ready();

    buyerAddressFactory = new BuyerAddressFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /buyer/create-buyer-address/:buyerId", async () => {
    const { accessToken, user } = await createAndAuthenticateUser(app);

    const buyerId = user.id;

    await buyerAddressFactory.makePrismaBuyerAddress({
      buyerId: new UniqueEntityID(buyerId),
      city: "Canguaretama",
    });

    const result = await request(app.server)
      .get(`/buyer/buyer-address/${buyerId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(200);
    expect(result.body.buyerAddress).toEqual(
      expect.objectContaining([
        expect.objectContaining({ city: "Canguaretama" }),
      ]),
    );
  });
});
