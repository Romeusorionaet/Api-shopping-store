import request from "supertest";
import { app } from "src/infra/app";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import {
  CreateAndAuthenticateUserAdminWithTokensFactory,
  CreateAndAuthenticateUserWithTokensFactory,
} from "test/factories/make-create-and-authenticate-user";

describe("Create Category (E2E)", () => {
  let createAndAuthenticateUserAdminWithTokensFactory: CreateAndAuthenticateUserAdminWithTokensFactory;
  let createAndAuthenticateUserWithTokensFactory: CreateAndAuthenticateUserWithTokensFactory;

  beforeAll(async () => {
    await app.ready();

    createAndAuthenticateUserAdminWithTokensFactory =
      new CreateAndAuthenticateUserAdminWithTokensFactory();
    createAndAuthenticateUserWithTokensFactory =
      new CreateAndAuthenticateUserWithTokensFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /category", async () => {
    const { accessToken } =
      await createAndAuthenticateUserAdminWithTokensFactory.makePrismaCreateAndAuthenticateUserAdminWithTokens(
        app,
      );

    const response = await request(app.server)
      .post("/category/create")
      .send({
        title: "category test title create 01",
        imgUrl: "http://teste.com.br",
        commit: "commit test",
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(201);

    const categoryOnDatabase = await prisma.category.findUnique({
      where: {
        title: "category test title create 01",
      },
    });

    expect(categoryOnDatabase).toBeTruthy();
  });

  test("[POST] /category - should not be able a common user create a category", async () => {
    const { accessToken } =
      await createAndAuthenticateUserWithTokensFactory.makePrismaCreateAndAuthenticateUserWithTokens(
        app,
      );

    const response = await request(app.server)
      .post("/category/create")
      .send({
        title: "category created by common user",
        imgUrl: "http://teste.com.br",
        commit: "commit test",
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(401);

    const categoryOnDatabase = await prisma.category.findUnique({
      where: {
        title: "category created by common user",
      },
    });

    expect(categoryOnDatabase).toBeFalsy();
  });

  test("[POST] /category - should not be able to create a category twice with the same title", async () => {
    const { accessToken } =
      await createAndAuthenticateUserAdminWithTokensFactory.makePrismaCreateAndAuthenticateUserAdminWithTokens(
        app,
      );

    await request(app.server)
      .post("/category/create")
      .send({
        title: "category test title twice 02",
        imgUrl: "http://teste.com.br",
        commit: "commit test",
      })
      .set("Authorization", `Bearer ${accessToken}`);

    const response = await request(app.server)
      .post("/category/create")
      .send({
        title: "category test title twice 02",
        imgUrl: "http://teste.com.br",
        commit: "commit test",
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(400);
  });
});
