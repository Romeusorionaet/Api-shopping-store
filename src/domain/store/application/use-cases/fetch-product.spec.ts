import { describe, test, beforeEach, expect } from "vitest";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeProduct } from "test/factories/make-product";
import { SearchProductsUseCase } from "./search-products";

let productsRepository: InMemoryProductsRepository;
let sut: SearchProductsUseCase;

describe("Fetch Products", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new SearchProductsUseCase(productsRepository);
  });

  test("should be able fetch categories", async () => {
    const products1 = makeProduct({ title: "product javascript" });
    const products2 = makeProduct({ title: "product python" });
    const products3 = makeProduct({ title: "product java" });

    await productsRepository.create(products1);
    await productsRepository.create(products2);
    await productsRepository.create(products3);

    const result = await sut.execute({ query: "java", page: 1 });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2);
    }
  });
});
