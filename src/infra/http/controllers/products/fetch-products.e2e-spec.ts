import request from "supertest";
import { app } from "src/app";
import { ProductFactory } from "test/factories/make-product";
import { CategoryFactory } from "test/factories/make-category";

describe("Fetch Products (E2E)", () => {
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

  test("[GET] /products", async () => {
    const category = await categoryFactory.makePrismaCategory({
      title: "category title 01",
    });

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

    const response = await request(app.server).get("/products");

    expect(response.statusCode).toEqual(200);

    expect(response.body.products).toHaveLength(2);
    expect(response.body).toEqual({
      products: expect.arrayContaining([
        expect.objectContaining({ title: "product title 01" }),
        expect.objectContaining({ title: "product title 02" }),
      ]),
    });
  });
});
