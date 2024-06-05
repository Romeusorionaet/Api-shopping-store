import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { UpdateProductUseCase } from "./update-product";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { makeTechnicalProductDetails } from "test/factories/make-technical-products-details";
import { InMemoryProductDataStoreRepository } from "test/repositories/in-memory-product-data-store-repository";
import { InMemoryTechnicalProductDetailsRepository } from "test/repositories/in-memory-technical-product-details-repository";

let productsRepository: InMemoryProductsRepository;
let productDataStoreRepository: InMemoryProductDataStoreRepository;
let categoryRepository: InMemoryCategoriesRepository;
let orderRepository: InMemoryOrdersRepository;
let technicalProductDetailsRepository: InMemoryTechnicalProductDetailsRepository;
let sut: UpdateProductUseCase;

describe("Create Product", () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrdersRepository(productsRepository);

    productDataStoreRepository = new InMemoryProductDataStoreRepository();

    productsRepository = new InMemoryProductsRepository(
      productDataStoreRepository,
      orderRepository,
    );

    categoryRepository = new InMemoryCategoriesRepository();

    technicalProductDetailsRepository =
      new InMemoryTechnicalProductDetailsRepository();

    sut = new UpdateProductUseCase(
      productsRepository,
      technicalProductDetailsRepository,
    );
  });

  test("should be able to update a product", async () => {
    const category = makeCategory(
      { title: "category title for product 01" },
      new UniqueEntityID("category-id-01"),
    );

    await categoryRepository.create(category);

    const product = makeProduct({
      categoryId: category.id,
      title: "product register 01",
      description: "description for product",
      price: 200,
    });

    await productsRepository.create(product);

    const technicalProduct = makeTechnicalProductDetails({
      productId: product.id,
      brand: "Moto G",
    });

    await technicalProductDetailsRepository.create(technicalProduct);

    const result = await sut.execute({
      id: product.id.toString(),
      title: "product register 01 updated",
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

    expect(result.isRight()).toBe(true);

    expect(productsRepository.dataStore.items[0]).toEqual(
      expect.objectContaining({
        title: "product register 01 updated",
        description: "description for product updated",
        price: 150,
      }),
    );
  });
});
