import { describe, test, beforeEach, expect } from "vitest";
import { MakeProduct } from "test/factories/make-product";
import { SearchProductUseCase } from "./search-product";
import { MakeCategory } from "test/factories/make-category";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";

let productsRepository: InMemoryProductsRepository;
let sut: SearchProductUseCase;

describe("Search Product", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new SearchProductUseCase(productsRepository);
  });

  test("should be able to search for products", async () => {
    const product1 = MakeProduct({ title: "first product" });
    const product2 = MakeProduct({ title: "second product" });
    const product3 = MakeProduct({ title: "test different" });

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
      await productsRepository.create(MakeProduct({ title: `product ${i}` }));
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
    const firstCategory = MakeCategory({ title: "first category" });
    const secondCategory = MakeCategory({ title: "second category" });

    const firstProduct = MakeProduct({
      categoryId: firstCategory.id,
      categoryTitle: firstCategory.title,
    });

    const secondProduct = MakeProduct({
      categoryId: firstCategory.id,
      categoryTitle: firstCategory.title,
    });

    const thirdProduct = MakeProduct({
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
