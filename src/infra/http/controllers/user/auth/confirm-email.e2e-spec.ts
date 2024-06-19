import { hash } from "bcryptjs";
import { app } from "src/app";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Confirm email (E2E)", () => {
  let userFactory: UserFactory;

  beforeAll(async () => {
    await app.ready();

    userFactory = new UserFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /auth/confirm-email/:token", async () => {
    const user = await userFactory.makePrismaUser({
      email: "romeu@gmail.com",
      password: await hash("123456", 8),
    });

    const result = await request(app.server)
      .post(`/auth/confirm-email/${user.validationId!.toString()}`)
      .send({ token: user.validationId!.toString() });

    expect(result.statusCode).toEqual(200);

    const validationEmailUserOnDatabase = await prisma.user.findFirst({
      where: {
        id: user.id.toString(),
      },
    });

    expect(validationEmailUserOnDatabase?.emailVerified).toBeTruthy();
    expect(validationEmailUserOnDatabase?.validationId).toEqual("");
  });
});
