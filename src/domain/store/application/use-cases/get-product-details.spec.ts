import { expect, describe, test, beforeEach } from "vitest";
import { GetProductDetailsUseCase } from "./get-product-details";
import { InMemoryProductsRepository } from "src/test/repositories/in-memory-products-repository";
import { MakeProduct } from "src/test/factories/make-product";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

let productsRepository: InMemoryProductsRepository;
let sut: GetProductDetailsUseCase;

describe("Get Product Details", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new GetProductDetailsUseCase(productsRepository);
  });

  test("should be able to get product details", async () => {
    const product = MakeProduct(
      {
        categoryId: new UniqueEntityID("first-category-id"),
        title: "my product",
      },
      new UniqueEntityID("first-product-id"),
    );

    await productsRepository.create(product);

    const result = await sut.execute({ productId: product.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(productsRepository.items).toHaveLength(1);

    if (result.isRight()) {
      expect(result.value.product).toEqual(
        expect.objectContaining({
          id: new UniqueEntityID("first-product-id"),
          categoryId: new UniqueEntityID("first-category-id"),
          title: "my product",
        }),
      );
    }
  });
});
