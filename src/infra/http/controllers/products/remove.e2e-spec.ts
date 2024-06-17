import request from "supertest";
import { app } from "src/app";
import { ProductFactory } from "test/factories/make-product";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { CategoryFactory } from "test/factories/make-category";

describe("Remove Product (E2E)", () => {
  let productFactory: ProductFactory;
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    await app.ready();

    productFactory = new ProductFactory();
    categoryFactory = new CategoryFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[DELETE] /product/remove/:productId", async () => {
    const category = await categoryFactory.makePrismaCategory({
      title: "category title 01",
    });

    const product = await productFactory.makePrismaProduct({
      title: "product id 01",
      categoryId: category.id,
      categoryTitle: category.title,
    });

    const productId = product.id.toString();

    const response = await request(app.server).delete(
      `/product/remove/${productId}`,
    );

    expect(response.statusCode).toEqual(201);

    const productOnDatabase = await prisma.product.findUnique({
      where: {
        title: "product id 01",
      },
    });

    expect(productOnDatabase).toBeFalsy();
  });
});
