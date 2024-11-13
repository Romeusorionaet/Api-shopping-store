import request from "supertest";
import { app } from "src/infra/app";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { CategoryFactory } from "test/factories/make-category";
import { CreateAndAuthenticateUserAdminWithTokensFactory } from "test/factories/make-create-and-authenticate-user";

describe("Update Category (E2E)", () => {
  let categoryFactory: CategoryFactory;
  let createAndAuthenticateUserAdminWithTokensFactory: CreateAndAuthenticateUserAdminWithTokensFactory;

  beforeAll(async () => {
    await app.ready();

    categoryFactory = new CategoryFactory();
    createAndAuthenticateUserAdminWithTokensFactory =
      new CreateAndAuthenticateUserAdminWithTokensFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /category/update", async () => {
    const { accessToken } =
      await createAndAuthenticateUserAdminWithTokensFactory.makePrismaCreateAndAuthenticateUserAdminWithTokens(
        app,
      );

    const category = await categoryFactory.makePrismaCategory({
      title: "category test title create 01",
    });

    const response = await request(app.server)
      .put("/category/update")
      .send({
        id: category.id.toString(),
        title: "category test 01 updated",
        imgUrl: category.imgUrl,
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(201);

    const categoryOnDatabase = await prisma.category.findUnique({
      where: {
        title: "category test 01 updated",
      },
    });

    expect(categoryOnDatabase).toBeTruthy();
  });
});
