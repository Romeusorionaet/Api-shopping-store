import { InMemoryProductRepository } from "src/test/repositories/in-memory-product-repository";
import { describe, test, beforeEach, expect } from "vitest";
import { CreateProductUseCase } from "./create-product";
import { MakeProduct } from "src/test/factories/make-product";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { MakeCategory } from "src/test/factories/make-category";

let inMemoryProductRepository: InMemoryProductRepository;
let sut: CreateProductUseCase;

describe("Create Product", () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository();
    sut = new CreateProductUseCase(inMemoryProductRepository);
  });

  test("should be able create a product", async () => {
    const category = MakeCategory(
      { title: "category-title-01" },
      new UniqueEntityID("category-id-01"),
    );

    const product = MakeProduct(
      { categoryId: category.id },
      new UniqueEntityID("product-id-01"),
    );

    await inMemoryProductRepository.create(product);

    const result = await sut.execute({
      categoryId: category.id.toString(),
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
      star: product.star,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.product.categoryId.toString()).toEqual(
      "category-id-01",
    );
    expect(product.id.toString()).toEqual("product-id-01");
  });
});
