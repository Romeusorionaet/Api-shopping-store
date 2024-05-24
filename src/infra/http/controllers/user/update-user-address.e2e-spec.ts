import { app } from "src/app";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { prisma } from "src/infra/database/prisma/prisma";
import request from "supertest";
import { CreateAndAuthenticateUserWithTokensFactory } from "test/factories/make-create-and-authenticate-user";
import { UserAddressFactory } from "test/factories/make-user-address";

describe("Update user address (E2E)", () => {
  let userAddressFactory: UserAddressFactory;
  let createAndAuthenticateUserWithTokensFactory: CreateAndAuthenticateUserWithTokensFactory;

  beforeAll(async () => {
    await app.ready();

    userAddressFactory = new UserAddressFactory();
    createAndAuthenticateUserWithTokensFactory =
      new CreateAndAuthenticateUserWithTokensFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[PUT] /user/update-user-address", async () => {
    const { accessToken, user } =
      await createAndAuthenticateUserWithTokensFactory.makePrismaCreateAndAuthenticateUserWithTokens(
        app,
      );

    const userAddress = await userAddressFactory.makePrismaUserAddress({
      userId: new UniqueEntityID(user.id),
      city: "São Paulo",
      complement: "Beco passa nada",
    });

    const result = await request(app.server)
      .put("/user/update-user-address")
      .send({
        city: "Rio de Janeiro",
        complement: "Morro do sufoco",
        cep: 12345678,
        uf: userAddress.uf,
        street: userAddress.street,
        neighborhood: userAddress.neighborhood,
        houseNumber: userAddress.houseNumber,
        phoneNumber: userAddress.phoneNumber,
        username: userAddress.username,
        email: userAddress.email,
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(201);

    const userAddressUpdatedOnDatabase = await prisma.userAddress.findUnique({
      where: {
        id: userAddress.id.toString(),
      },
    });

    expect(userAddressUpdatedOnDatabase).toBeTruthy();
    expect(userAddressUpdatedOnDatabase).toEqual(
      expect.objectContaining({
        city: "Rio de Janeiro",
        complement: "Morro do sufoco",
      }),
    );
  });
});
