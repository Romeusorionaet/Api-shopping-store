import request from "supertest";
import { app } from "src/app";
import { ProductFactory } from "test/factories/make-product";
import { CategoryFactory } from "test/factories/make-category";

describe("Search Products (E2E)", () => {
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

  test("[GET] /products/search", async () => {
    const category = await categoryFactory.makePrismaCategory();

    await Promise.all([
      productFactory.makePrismaProduct({
        categoryId: category.id,
        title: "product title 01",
      }),

      productFactory.makePrismaProduct({
        categoryId: category.id,
        title: "product title 02",
      }),
    ]);

    const response = await request(app.server)
      .get("/products/search")
      .query({ query: "01", page: 1 });

    expect(response.statusCode).toEqual(200);
    expect(response.body.products).toHaveLength(1);
    expect(response.body).toEqual({
      products: expect.arrayContaining([
        expect.objectContaining({ title: "product title 01" }),
      ]),
    });
  });

  test("[GET] /products/search - should not be able to search with query empty", async () => {
    const category = await categoryFactory.makePrismaCategory();

    await Promise.all([
      productFactory.makePrismaProduct({
        categoryId: category.id,
        title: "product title 03",
      }),

      productFactory.makePrismaProduct({
        categoryId: category.id,
        title: "product title 04",
      }),
    ]);

    const response = await request(app.server)
      .get("/products/search")
      .query({ query: "", page: 1 });

    expect(response.statusCode).toEqual(400);
  });
});
