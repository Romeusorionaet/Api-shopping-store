import request from "supertest";
import { app } from "src/infra/app";
import { ProductFactory } from "test/factories/make-product";
import { CategoryFactory } from "test/factories/make-category";
import { TechnicalProductDetailsFactory } from "test/factories/make-technical-products-details";

describe("Product Details (E2E)", () => {
  let productFactory: ProductFactory;
  let categoryFactory: CategoryFactory;
  let technicalProductDetailsFactory: TechnicalProductDetailsFactory;

  beforeAll(async () => {
    await app.ready();

    productFactory = new ProductFactory();
    categoryFactory = new CategoryFactory();
    technicalProductDetailsFactory = new TechnicalProductDetailsFactory();
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

    await technicalProductDetailsFactory.makePrismaTechnicalProductDetails({
      productId: product.id,
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
        technicalProductDetails: expect.objectContaining({
          productId: product.id.toString(),
        }),
      }),
    );
  });
});
