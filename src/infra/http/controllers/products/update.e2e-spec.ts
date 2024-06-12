import request from "supertest";
import { app } from "src/app";
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

    const product = await productFactory.makePrismaProduct({
      categoryId: category.id,
      title: "product register 01",
      description: "description for product",
      price: 200,
    });

    const technicalProduct =
      await technicalProductDetailsFactory.makePrismaTechnicalProductDetails({
        productId: product.id,
        brand: "Moto G",
      });

    const response = await request(app.server)
      .put("/product/update")
      .send({
        id: product.id.toString(),
        title: "product 01 updated",
        description: "description for product updated",
        price: 150,
        imgUrlList: product.imgUrlList,
        stockQuantity: product.stockQuantity,
        minimumQuantityStock: product.minimumQuantityStock,
        discountPercentage: product.discountPercentage,
        corsList: product.corsList,
        placeOfSale: product.placeOfSale,
        technicalProductDetails: {
          technicalProductId: technicalProduct.id.toString(),
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
      });

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
