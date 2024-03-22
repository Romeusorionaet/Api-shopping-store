import request from "supertest";
import { app } from "src/app";
import { prisma } from "src/infra/database/prisma/prisma";
import { CategoryFactory } from "test/factories/make-category";

describe("Update Category (E2E)", () => {
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    await app.ready();

    categoryFactory = new CategoryFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /category/update", async () => {
    const category = await categoryFactory.makePrismaCategory({
      title: "category test title create 01",
    });

    const response = await request(app.server).put("/category/update").send({
      id: category.id.toString(),
      title: "category test 01 updated",
      imgUrl: category.imgUrl,
    });

    expect(response.statusCode).toEqual(201);

    const categoryOnDatabase = await prisma.category.findUnique({
      where: {
        title: "category test 01 updated",
      },
    });

    expect(categoryOnDatabase).toBeTruthy();
  });
});
