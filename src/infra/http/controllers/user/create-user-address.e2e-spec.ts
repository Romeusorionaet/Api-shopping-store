import { app } from "src/app";
import { prisma } from "src/infra/database/prisma/prisma";
import request from "supertest";
import { CreateAndAuthenticateUserWithTokensFactory } from "test/factories/make-create-and-authenticate-user";

describe("Create user address (E2E)", () => {
  let createAndAuthenticateUserWithTokensFactory: CreateAndAuthenticateUserWithTokensFactory;

  beforeAll(async () => {
    await app.ready();

    createAndAuthenticateUserWithTokensFactory =
      new CreateAndAuthenticateUserWithTokensFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /user/create-address", async () => {
    const { accessToken, user } =
      await createAndAuthenticateUserWithTokensFactory.makePrismaCreateAndAuthenticateUserWithTokens(
        app,
      );

    const userId = user.id;

    const result = await request(app.server)
      .post("/user/create-address")
      .send({
        userId: userId.toString(),
        cep: 12345678,
        city: "acytfff avenfireg rg",
        uf: "Nm",
        street: "street egrghh t",
        neighborhood: "iee vrerg erg ",
        houseNumber: 489,
        complement: "e rger g eor gregerger erg",
        phoneNumber: "1234567891",
        username: "romeu soares",
        email: "romeusoaresdesouto@gmail.com",
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(201);

    const userAddressOnDatabase = await prisma.userAddress.findFirst({
      where: {
        email: "romeusoaresdesouto@gmail.com",
      },
    });

    expect(userAddressOnDatabase).toBeTruthy();
  });
});
