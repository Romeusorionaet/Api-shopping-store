import { CreateProductUseCase } from "./create-product";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { makeTechnicalProductDetails } from "test/factories/make-technical-products-details";
import { InMemoryProductDataStoreRepository } from "test/repositories/in-memory-product-data-store-repository";
import { InMemoryTechnicalProductDetailsRepository } from "test/repositories/in-memory-technical-product-details-repository";

let productsRepository: InMemoryProductsRepository;
let productDataStoreRepository: InMemoryProductDataStoreRepository;
let categoryRepository: InMemoryCategoriesRepository;
let orderRepository: InMemoryOrdersRepository;
let technicalProductDetailsRepository: InMemoryTechnicalProductDetailsRepository;
let sut: CreateProductUseCase;

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

    sut = new CreateProductUseCase(
      productsRepository,
      categoryRepository,
      technicalProductDetailsRepository,
    );
  });

  test("should be able create a product", async () => {
    const category = makeCategory(
      { title: "category title for product 01" },
      new UniqueEntityID("category-id-01"),
    );

    await categoryRepository.create(category);

    const product = makeProduct({
      categoryId: category.id,
      title: "first product register 01",
    });

    const technicalProductDetails = makeTechnicalProductDetails({
      productId: product.id,
    });

    const result = await sut.execute({
      categoryId: category.id.toString(),
      categoryTitle: category.title,
      title: product.title,
      description: product.description,
      price: product.price,
      imgUrlList: product.imgUrlList,
      stockQuantity: product.stockQuantity,
      minimumQuantityStock: product.minimumQuantityStock,
      discountPercentage: product.discountPercentage,
      corsList: product.corsList,
      placeOfSale: product.placeOfSale,
      stars: product.stars,
      technicalProductDetails,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value?.product.categoryId.toString()).toEqual(
        "category-id-01",
      );
    }
  });
});
