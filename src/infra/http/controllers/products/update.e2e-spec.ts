import request from "supertest";
import { app } from "src/infra/app";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { ProductFactory } from "test/factories/make-product";
import { CategoryFactory } from "test/factories/make-category";
import { TechnicalProductDetailsFactory } from "test/factories/make-technical-products-details";

describe("Update Product (E2E)", () => {
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

  test("[PUT] /product/update", async () => {
    const category = await categoryFactory.makePrismaCategory();

    const productCreated = await productFactory.makePrismaProduct({
      categoryId: category.id,
      title: "product register 01",
      description: "description for product",
      price: 200,
    });

    const technicalProduct =
      await technicalProductDetailsFactory.makePrismaTechnicalProductDetails({
        productId: productCreated.id,
        brand: "Moto G",
      });

    const product = {
      id: productCreated.id.toString(),
      technicalProductId: technicalProduct.id.toString(),
      categoryId: category.id.toString(),
      categoryTitle: category.title,
      title: "product 01 updated",
      description: "description for product updated",
      price: 150,
      imgUrlList: productCreated.imgUrlList,
      stockQuantity: productCreated.stockQuantity,
      minimumQuantityStock: productCreated.minimumQuantityStock,
      discountPercentage: productCreated.discountPercentage,
      corsList: productCreated.corsList,
      placeOfSale: productCreated.placeOfSale,
      technicalProductDetails: {
        brand: "Iphone",
        ram: technicalProduct.ram,
        rom: technicalProduct.rom,
        width: technicalProduct.width,
        height: technicalProduct.height,
        weight: technicalProduct.weight,
        model: technicalProduct.model,
        averageBatteryLife: technicalProduct.averageBatteryLife,
        batteryCapacity: technicalProduct.batteryCapacity,
        operatingSystem: technicalProduct.operatingSystem,
        processorBrand: technicalProduct.processorBrand,
        screenOrWatchFace: technicalProduct.screenOrWatchFace,
        videoCaptureResolution: technicalProduct.videoCaptureResolution,
        videoResolution: technicalProduct.videoResolution,
      },
    };

    const response = await request(app.server)
      .put("/product/update")
      .send({ product });

    expect(response.statusCode).toEqual(201);

    const productOnDatabase = await prisma.product.findUnique({
      where: {
        title: "product 01 updated",
      },
    });

    const technicalProductOnDataBase =
      await prisma.technicalProductDetails.findFirst({
        where: {
          productId: product.id.toString(),
        },
      });

    expect(productOnDatabase).toBeTruthy();
    expect(technicalProductOnDataBase).toBeTruthy();

    expect(productOnDatabase).toEqual(
      expect.objectContaining({
        title: "product 01 updated",
        description: "description for product updated",
        price: 150,
      }),
    );
    expect(technicalProductOnDataBase).toEqual(
      expect.objectContaining({
        brand: "Iphone",
      }),
    );
  });
});
