import request from "supertest";
import { app } from "src/app";
import { ProductFactory } from "test/factories/make-product";
import { CategoryFactory } from "test/factories/make-category";

describe("Product Details (E2E)", () => {
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

  test("[GET] /product/details/:id", async () => {
    const category = await categoryFactory.makePrismaCategory();

    const product = await productFactory.makePrismaProduct({
      categoryId: category.id,
      title: "product for test get product details id",
    });

    const response = await request(app.server).get(
      `/product/details/${product.id}`,
    );

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        product: expect.objectContaining({
          title: "product for test get product details id",
        }),
      }),
    );
  });
});
