import { app } from "src/app";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import request from "supertest";
import { BuyerAddressFactory } from "test/factories/make-buyer-address";
import { CreateAndAuthenticateUserWithTokensFactory } from "test/factories/make-create-and-authenticate-user";

describe("Get buyer address (E2E)", () => {
  let buyerAddressFactory: BuyerAddressFactory;
  let createAndAuthenticateUserWithTokensFactory: CreateAndAuthenticateUserWithTokensFactory;

  beforeAll(async () => {
    await app.ready();

    buyerAddressFactory = new BuyerAddressFactory();
    createAndAuthenticateUserWithTokensFactory =
      new CreateAndAuthenticateUserWithTokensFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /buyer/buyer-address/:buyerId", async () => {
    const { accessToken, user } =
      await createAndAuthenticateUserWithTokensFactory.makePrismaCreateAndAuthenticateUserWithTokens(
        app,
      );

    const buyerId = user.id;

    await buyerAddressFactory.makePrismaBuyerAddress({
      buyerId: new UniqueEntityID(buyerId),
      city: "Canguaretama",
    });
    console.log(accessToken, "====e2e");

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
