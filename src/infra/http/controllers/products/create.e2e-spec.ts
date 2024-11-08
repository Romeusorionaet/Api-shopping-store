import request from "supertest";
import { app } from "src/infra/app";
import { prisma } from "src/infra/service/setup-prisma/prisma";
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

  test("[POST] /product/create", async () => {
    const category = await categoryFactory.makePrismaCategory();

    const product = {
      categoryId: category.id.toString(),
      categoryTitle: category.title,
      title: "product test title 01",
      description: "description product",
      price: 5368576,
      imgUrlList: ["img1", "img2", "img3", "img4"],
      stockQuantity: 84600,
      minimumQuantityStock: 43696,
      discountPercentage: 41178,
      corsList: ["color1", "color2", "color3", "color4"],
      placeOfSale: "ONLINE_STORE",
      stars: 0,
      technicalProductDetails: {
        width: "5",
        height: "14",
        weight: "380",
        brand: "Xiaomi",
        model: "Redmi note 7",
        ram: "4",
        rom: "64",
        averageBatteryLife: "22,5 Horas",
        batteryCapacity: "5000 Milliamp Hours",
        operatingSystem: "Android",
        processorBrand: "mediatek",
        screenOrWatchFace: "LCD",
        videoCaptureResolution: "1080p",
        videoResolution: "8 Pixels",
      },
    };

    const response = await request(app.server)
      .post("/product/create")
      .send({ product });

    expect(response.statusCode).toEqual(201);

    const productOnDatabase = await prisma.product.findUnique({
      where: {
        title: "product test title 01",
      },
    });

    expect(productOnDatabase).toBeTruthy();
  });

  test("[POST] /product/create: should not be able to create a product twice with the same title", async () => {
    const category = await categoryFactory.makePrismaCategory();

    await productFactory.makePrismaProduct({
      categoryId: category.id,
      categoryTitle: category.title,
      title: "product test title 02",
    });

    const response = await request(app.server)
      .post("/product/create")
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
        corsList: ["color1", "color2", "color3", "color4"],
        placeOfSale: "ONLINE_STORE",
        stars: 0,
        technicalProductDetails: {
          width: "5",
          height: "14",
          weight: "380",
          brand: "Xiaomi",
          model: "Redmi note 7",
          ram: "4",
          rom: "64",
          averageBatteryLife: "22,5 Horas",
          batteryCapacity: "5000 Milliamp Hours",
          operatingSystem: "Android",
          processorBrand: "mediatek",
          screenOrWatchFace: "LCD",
          videoCaptureResolution: "1080p",
          videoResolution: "8 Pixels",
        },
      });

    expect(response.statusCode).toEqual(400);
  });
});
