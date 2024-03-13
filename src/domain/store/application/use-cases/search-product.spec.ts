import { describe, test, beforeEach, expect } from "vitest";
import { SearchProductUseCase } from "./search-product";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeProduct } from "test/factories/make-product";
import { makeCategory } from "test/factories/make-category";

let productsRepository: InMemoryProductsRepository;
let sut: SearchProductUseCase;

describe("Search Product", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new SearchProductUseCase(productsRepository);
  });

  test("should be able to search for products", async () => {
    const product1 = makeProduct({ title: "first product" });
    const product2 = makeProduct({ title: "second product" });
    const product3 = makeProduct({ title: "test different" });

    await productsRepository.create(product1);
    await productsRepository.create(product2);
    await productsRepository.create(product3);

    const result = await sut.execute({ query: "Product", page: 1 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.product).toHaveLength(2);
    }
  });

  test("should be able to fetch paginated product search", async () => {
    for (let i = 1; i <= 22; i++) {
      await productsRepository.create(makeProduct({ title: `product ${i}` }));
    }

    const result = await sut.execute({
      query: "product",
      page: 2,
    });

    if (result.isRight()) {
      expect(result.value.product).toHaveLength(2);
      expect(result.value.product).toEqual([
        expect.objectContaining({ title: "product 21" }),
        expect.objectContaining({ title: "product 22" }),
      ]);
    }
  });

  test("should be able to search for products by category title", async () => {
    const firstCategory = makeCategory({ title: "first category" });
    const secondCategory = makeCategory({ title: "second category" });

    const firstProduct = makeProduct({
      categoryId: firstCategory.id,
      categoryTitle: firstCategory.title,
    });

    const secondProduct = makeProduct({
      categoryId: firstCategory.id,
      categoryTitle: firstCategory.title,
    });

    const thirdProduct = makeProduct({
      categoryId: secondCategory.id,
      categoryTitle: secondCategory.title,
    });

    await productsRepository.create(firstProduct);
    await productsRepository.create(secondProduct);
    await productsRepository.create(thirdProduct);

    const result = await sut.execute({ query: "first", page: 1 });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product).toHaveLength(2);
    }
  });
});
