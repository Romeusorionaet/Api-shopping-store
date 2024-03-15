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

  test("[GET] /buyer/create-buyer-address", async () => {
    const { accessToken } = await createAndAuthenticateUser(app);

    const responseProfile = await request(app.server)
      .get("/buyer/profile")
      .set("Authorization", `Bearer ${accessToken}`);

    const userId = responseProfile.body.profile.id;

    const buyerAddress = await buyerAddressFactory.makePrismaBuyerAddress({
      buyerId: userId,
      city: "Canguaretama",
    });

    const buyerAddressId = buyerAddress.id.toString();

    const result = await request(app.server).get(
      `/buyer/buyer-address/${buyerAddressId}`,
    );

    expect(result.statusCode).toBe(200);
    expect(result.body.buyerAddress).toEqual(
      expect.objectContaining({ city: "Canguaretama" }),
    );
  });
});
