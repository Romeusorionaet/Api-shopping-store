import { describe, test, beforeEach, expect } from "vitest";
import { CreateProductUseCase } from "./create-product";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";

let productsRepository: InMemoryProductsRepository;
let categoryRepository: InMemoryCategoriesRepository;
let sut: CreateProductUseCase;

describe("Create Product", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();

    categoryRepository = new InMemoryCategoriesRepository();

    sut = new CreateProductUseCase(productsRepository, categoryRepository);
  });

  test("should be able create a product", async () => {
    const category = makeCategory(
      { title: "category title for product 01" },
      new UniqueEntityID("category-id-01"),
    );

    const product = makeProduct({
      categoryId: category.id,
      title: "first product register 01",
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
      width: product.width,
      height: product.height,
      weight: product.weight,
      corsList: product.corsList,
      placeOfSale: product.placeOfSale,
      stars: product.stars,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value?.product.categoryId.toString()).toEqual(
        "category-id-01",
      );
    }
  });
});
