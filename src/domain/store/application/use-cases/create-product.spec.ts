import { InMemoryProductRepository } from "src/test/repositories/in-memory-product-repository";
import { describe, test, beforeEach, expect } from "vitest";
import { CreateProductUseCase } from "./create-product";
import { MakeProduct } from "src/test/factories/make-product";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

let inMemoryProductRepository = new InMemoryProductRepository();
let sut: CreateProductUseCase;

describe("Create Product", () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository();
    sut = new CreateProductUseCase(inMemoryProductRepository);
  });

  test("should be create a product", async () => {
    const productCreated = MakeProduct(
      { categoryId: new UniqueEntityID("category-id-1") },
      new UniqueEntityID("product-id-1"),
    );

    await inMemoryProductRepository.create(productCreated);

    const result = await sut.execute({
      categoryId: productCreated.categoryId.toString(),
      title: productCreated.title,
      description: productCreated.description,
      price: productCreated.price,
      imgUrlList: productCreated.imgUrlList,
      stockQuantity: productCreated.stockQuantity,
      minimumQuantityStock: productCreated.minimumQuantityStock,
      discountPercentage: productCreated.discountPercentage,
      width: productCreated.width,
      height: productCreated.height,
      weight: productCreated.weight,
      corsList: productCreated.corsList,
      placeOfSale: productCreated.placeOfSale,
      star: productCreated.star,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.product.categoryId.toString()).toEqual(
      "category-id-1",
    );
    expect(productCreated.id.toString()).toEqual("product-id-1");
  });
});
