import { app } from "src/app";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { prisma } from "src/infra/database/prisma/prisma";
import request from "supertest";
import { BuyerAddressFactory } from "test/factories/make-buyer-address";
import { CreateAndAuthenticateUserWithTokensFactory } from "test/factories/make-create-and-authenticate-user";

describe("Update buyer address (E2E)", () => {
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

  test("[PUT] /buyer/update-buyer-address", async () => {
    const { accessToken, user } =
      await createAndAuthenticateUserWithTokensFactory.makePrismaCreateAndAuthenticateUserWithTokens(
        app,
      );

    const buyerAddress = await buyerAddressFactory.makePrismaBuyerAddress({
      buyerId: new UniqueEntityID(user.id),
      city: "São Paulo",
      complement: "Beco passa nada",
    });

    const result = await request(app.server)
      .put("/buyer/update-buyer-address")
      .send({
        id: buyerAddress.id.toString(),
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
      })
      .set("Authorization", `Bearer ${accessToken}`);

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
