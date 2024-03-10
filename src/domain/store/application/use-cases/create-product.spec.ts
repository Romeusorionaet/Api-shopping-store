import { describe, test, beforeEach, expect } from "vitest";
import { CreateProductUseCase } from "./create-product";
import { MakeProduct } from "test/factories/make-product";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { MakeCategory } from "test/factories/make-category";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";

let productsRepository: InMemoryProductsRepository;
let sut: CreateProductUseCase;

describe("Create Product", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new CreateProductUseCase(productsRepository);
  });

  test("should be able create a product", async () => {
    const category = MakeCategory(
      { title: "category title for product 01" },
      new UniqueEntityID("category-id-01"),
    );

    const product = MakeProduct({
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
