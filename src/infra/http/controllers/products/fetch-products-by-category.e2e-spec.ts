import request from "supertest";
import { app } from "src/app";
import { ProductFactory } from "test/factories/make-product";
import { CategoryFactory } from "test/factories/make-category";

describe("Fetch Products by category (E2E)", () => {
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

  test("[GET] /products/same-category", async () => {
    const category1 = await categoryFactory.makePrismaCategory();

    const category2 = await categoryFactory.makePrismaCategory();

    await Promise.all([
      productFactory.makePrismaProduct({
        categoryId: category1.id,
      }),

      productFactory.makePrismaProduct({
        categoryId: category1.id,
      }),

      productFactory.makePrismaProduct({
        categoryId: category2.id,
      }),
    ]);

    const response = await request(app.server)
      .get("/products/same-category")
      .query({ categoryId: category1.id.toString(), page: 1 });

    expect(response.statusCode).toEqual(200);
    expect(response.body.products).toHaveLength(2);
    expect(response.body).toEqual({
      products: expect.arrayContaining([
        expect.objectContaining({ categoryId: category1.id.toString() }),
      ]),
    });
  });
});
