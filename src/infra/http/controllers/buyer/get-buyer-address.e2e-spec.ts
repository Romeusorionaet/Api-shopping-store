import { app } from "src/app";
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
    const { accessToken } = await createAndAuthenticateUser(app);

    const responseProfile = await request(app.server)
      .get("/buyer/profile")
      .set("Authorization", `Bearer ${accessToken}`);

    const buyerId = responseProfile.body.profile.id;

    await buyerAddressFactory.makePrismaBuyerAddress({
      buyerId,
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
