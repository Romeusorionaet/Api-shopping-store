import request from "supertest";
import { app } from "src/app";
import { prisma } from "src/infra/database/prisma/prisma";
import { ProductFactory } from "test/factories/make-product";
import { CategoryFactory } from "test/factories/make-category";

describe("Update Product (E2E)", () => {
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

  test("[PUT] /product/update", async () => {
    const category = await categoryFactory.makePrismaCategory();

    const product = await productFactory.makePrismaProduct({
      categoryId: category.id,
      title: "product register 01",
      description: "description for product",
      price: 200,
    });

    const response = await request(app.server).put("/product/update").send({
      productId: product.id.toString(),
      title: "product 01 updated",
      description: "description for product updated",
      price: 150,
      imgUrlList: product.imgUrlList,
      stockQuantity: product.stockQuantity,
      minimumQuantityStock: product.minimumQuantityStock,
      discountPercentage: product.discountPercentage,
      width: product.width,
      height: product.height,
      weight: product.weight,
      corsList: product.corsList,
      placeOfSale: product.placeOfSale,
    });

    expect(response.statusCode).toEqual(201);

    const productOnDatabase = await prisma.product.findUnique({
      where: {
        title: "product 01 updated",
      },
    });

    expect(productOnDatabase).toBeTruthy();

    expect(productOnDatabase).toEqual(
      expect.objectContaining({
        title: "product 01 updated",
        description: "description for product updated",
        price: 150,
      }),
    );
  });
});
