import request from "supertest";
import { app } from "src/app";
import { prisma } from "src/infra/database/prisma/prisma";
import { ProductFactory } from "test/factories/make-product";
import { CategoryFactory } from "test/factories/make-category";

describe("Create Product (E2E)", () => {
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

  test("[POST] /product", async () => {
    const category = await categoryFactory.makePrismaCategory();

    const response = await request(app.server)
      .post("/product")
      .send({
        categoryId: category.id.toString(),
        categoryTitle: category.title,
        title: "product test title 01",
        description: "description product",
        price: 5368576,
        imgUrlList: ["img1", "img2", "img3", "img4"],
        stockQuantity: 84600,
        minimumQuantityStock: 43696,
        discountPercentage: 41178,
        width: 656484,
        height: 3966472,
        weight: 1362780,
        corsList: ["color1", "color2", "color3", "color4"],
        placeOfSale: "ONLINE_STORE",
        stars: 0,
      });

    expect(response.statusCode).toEqual(201);

    const productOnDatabase = await prisma.product.findUnique({
      where: {
        title: "product test title 01",
      },
    });

    expect(productOnDatabase).toBeTruthy();
  });

  test("[POST] should not be able to create a product twice with the same title", async () => {
    const category = await categoryFactory.makePrismaCategory();

    await productFactory.makePrismaProduct({
      categoryId: category.id,
      categoryTitle: category.title,
      title: "product test title 02",
    });

    const response = await request(app.server)
      .post("/product")
      .send({
        categoryId: category.id.toString(),
        categoryTitle: category.title,
        title: "product test title 02",
        description:
          "Cauda advoco coruscus tristis talus abduco centum adnuo aiunt.\n" +
          "Ullam urbanus conspergo amaritudo aureus deleniti amor ascit natus canto.",
        price: 5368576,
        imgUrlList: ["img1", "img2", "img3", "img4"],
        stockQuantity: 600,
        minimumQuantityStock: 43,
        discountPercentage: 478,
        width: 64,
        height: 392,
        weight: 130,
        corsList: ["color1", "color2", "color3", "color4"],
        placeOfSale: "ONLINE_STORE",
        stars: 0,
      });

    expect(response.statusCode).toEqual(400);
  });
});
