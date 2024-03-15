import { app } from "src/app";
import { prisma } from "src/infra/database/prisma/prisma";
import request from "supertest";
import { BuyerAddressFactory } from "test/factories/make-buyer-address";
import { createAndAuthenticateUser } from "test/factories/make-create-and-authenticate-user";

describe("Update buyer address (E2E)", () => {
  let buyerAddressFactory: BuyerAddressFactory;

  beforeAll(async () => {
    await app.ready();

    buyerAddressFactory = new BuyerAddressFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[PUT] /buyer/update-buyer-address", async () => {
    const { accessToken } = await createAndAuthenticateUser(app);

    const responseProfile = await request(app.server)
      .get("/buyer/profile")
      .set("Authorization", `Bearer ${accessToken}`);

    const userId = responseProfile.body.profile.id;

    const buyerAddress = await buyerAddressFactory.makePrismaBuyerAddress({
      buyerId: userId,
      city: "São Paulo",
      complement: "Beco passa nada",
    });

    const result = await request(app.server)
      .put("/buyer/update-buyer-address")
      .send({
        addressId: buyerAddress.id.toString(),
        city: "Rio de Janeiro",
        complement: "Morro do sufoco",
        cep: 12345678,
        uf: buyerAddress.uf,
        street: buyerAddress.street,
        neighborhood: buyerAddress.neighborhood,
        houseNumber: buyerAddress.houseNumber,
        phoneNumber: buyerAddress.phoneNumber,
        username: buyerAddress.username,
        email: buyerAddress.email,
      });

    expect(result.statusCode).toBe(201);

    const buyerAddressUpdatedOnDatabase = await prisma.buyerAddress.findUnique({
      where: {
        id: buyerAddress.id.toString(),
      },
    });

    expect(buyerAddressUpdatedOnDatabase).toBeTruthy();
    expect(buyerAddressUpdatedOnDatabase).toEqual(
      expect.objectContaining({
        city: "Rio de Janeiro",
        complement: "Morro do sufoco",
      }),
    );
  });
});
