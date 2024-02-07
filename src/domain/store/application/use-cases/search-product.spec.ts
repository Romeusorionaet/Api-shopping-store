import { InMemoryProductRepository } from "src/test/repositories/in-memory-product-repository";
import { describe, test, beforeEach, expect } from "vitest";
import { MakeProduct } from "src/test/factories/make-product";
import { SearchProductUseCase } from "./search-product";

let inMemoryProductRepository: InMemoryProductRepository;
let sut: SearchProductUseCase;

describe("Search Product", () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository();
    sut = new SearchProductUseCase(inMemoryProductRepository);
  });

  test.only("should be able to search for products", async () => {
    const product1 = MakeProduct({ title: "first product" });
    const product2 = MakeProduct({ title: "second product" });
    const product3 = MakeProduct({ title: "test different" });

    await inMemoryProductRepository.create(product1);
    await inMemoryProductRepository.create(product2);
    await inMemoryProductRepository.create(product3);

    const result = await sut.execute({ query: "Product", page: 1 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.product).toHaveLength(2);
    }
  });

  test("should be able to fetch paginated product search", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryProductRepository.create(
        MakeProduct({ title: `product ${i}` }),
      );
    }

    const result = await sut.execute({
      query: "product",
      page: 2,
    });

    if (result.isRight()) {
      expect(result.value.product).toHaveLength(2);
      expect(result.value.product).toEqual([
        expect.objectContaining({ title: "product 21" }),
        expect.objectContaining({ title: "Product 22" }),
      ]);
    }
  });
});
