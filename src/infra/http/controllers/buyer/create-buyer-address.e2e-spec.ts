import { app } from "src/app";
import { prisma } from "src/infra/database/prisma/prisma";
import request from "supertest";
import { createAndAuthenticateUser } from "test/factories/make-create-and-authenticate-user";

describe("Create buyer address (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /buyer/create-buyer-address", async () => {
    const { accessToken } = await createAndAuthenticateUser(app);

    const responseProfile = await request(app.server)
      .get("/buyer/profile")
      .set("Authorization", `Bearer ${accessToken}`);

    const userId = responseProfile.body.profile.id;

    const result = await request(app.server)
      .post("/buyer/create-buyer-address")
      .send({
        buyerId: userId.toString(),
        cep: 12345678,
        city: "acytfff avenfireg rg",
        uf: "Nm",
        street: "street egrghh t",
        neighborhood: "iee vrerg erg ",
        houseNumber: 489,
        complement: "e rger g eor gregerger erg",
        phoneNumber: 1234567891,
        username: "romeu soares",
        email: "romeusoaresdesouto@gmail.com",
      });

    expect(result.statusCode).toBe(201);

    const buyerAddressOnDatabase = await prisma.buyerAddress.findFirst({
      where: {
        email: "romeusoaresdesouto@gmail.com",
      },
    });

    expect(buyerAddressOnDatabase).toBeTruthy();
  });
});
