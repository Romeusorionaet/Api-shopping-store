import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { UpdateProductUseCase } from "./update-product";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { makeTechnicalProductDetails } from "test/factories/make-technical-products-details";

let productsRepository: InMemoryProductsRepository;
let categoryRepository: InMemoryCategoriesRepository;
let orderRepository: InMemoryOrdersRepository;
let sut: UpdateProductUseCase;

describe("Create Product", () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrdersRepository(productsRepository);

    productsRepository = new InMemoryProductsRepository(orderRepository);

    categoryRepository = new InMemoryCategoriesRepository();

    sut = new UpdateProductUseCase(productsRepository);
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

    await productsRepository.createTechnicalProductDetails(technicalProduct);

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

    expect(productsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: "product register 01 updated",
        description: "description for product updated",
        price: 150,
      }),
    );
  });
});
