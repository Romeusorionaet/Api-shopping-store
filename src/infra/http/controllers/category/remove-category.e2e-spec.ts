import request from "supertest";
import { app } from "src/infra/app";
import { CategoryFactory } from "test/factories/make-category";
import { prisma } from "src/infra/service/setup-prisma/prisma";

describe("Remove Category (E2E)", () => {
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    await app.ready();

    categoryFactory = new CategoryFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[DELETE] /category/remove/:categoryId", async () => {
    const category = await categoryFactory.makePrismaCategory({
      title: "category id 01",
    });

    const categoryId = category.id.toString();

    const response = await request(app.server).delete(
      `/category/remove/${categoryId}`,
    );

    expect(response.statusCode).toEqual(201);

    const categoryOnDatabase = await prisma.category.findUnique({
      where: {
        title: "category id 01",
      },
    });

    expect(categoryOnDatabase).toBeFalsy();
  });
});
