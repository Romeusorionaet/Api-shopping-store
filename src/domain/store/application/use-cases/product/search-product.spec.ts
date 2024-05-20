import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeProduct } from "test/factories/make-product";
import { SearchProductsUseCase } from "./search-products";
import { makeCategory } from "test/factories/make-category";

let productsRepository: InMemoryProductsRepository;
let sut: SearchProductsUseCase;

describe("Search Products", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new SearchProductsUseCase(productsRepository);
  });

  test("should be able to search products", async () => {
    const products1 = makeProduct({ title: "product javascript" });
    const products2 = makeProduct({ title: "product python" });
    const products3 = makeProduct({ title: "product java" });

    await Promise.all([
      productsRepository.create(products1),
      productsRepository.create(products2),
      productsRepository.create(products3),
    ]);

    const result = await sut.execute({ query: "java", page: 1 });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2);
    }
  });

  test("should be able to fetch paginated products by search", async () => {
    for (let i = 1; i <= 22; i++) {
      await productsRepository.create(makeProduct({ title: `product ${i}` }));
    }

    const result = await sut.execute({
      query: "product",
      page: 2,
    });

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2);
      expect(result.value.products).toEqual([
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

    await Promise.all([
      await productsRepository.create(firstProduct),
      await productsRepository.create(secondProduct),
      await productsRepository.create(thirdProduct),
    ]);

    const result = await sut.execute({ query: "first", page: 1 });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2);
    }
  });
});
