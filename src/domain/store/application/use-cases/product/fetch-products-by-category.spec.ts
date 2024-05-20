import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeProduct } from "test/factories/make-product";
import { FetchProductsByCategoryUseCase } from "./fetch-products-by-category";

let productsRepository: InMemoryProductsRepository;
let sut: FetchProductsByCategoryUseCase;

describe("Fetch products by category title", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new FetchProductsByCategoryUseCase(productsRepository);
  });

  test("should be able to fetch products by category title", async () => {
    const products1 = makeProduct({
      title: "ball",
      categoryTitle: "sports",
    });
    const products2 = makeProduct({
      title: "cell phone",
      categoryTitle: "Electronics Products",
    });
    const products3 = makeProduct({
      title: "notebook",
      categoryTitle: "Electronics Products",
    });

    await Promise.all([
      productsRepository.create(products1),
      productsRepository.create(products2),
      productsRepository.create(products3),
    ]);

    const result = await sut.execute({ slug: "Electronics Products", page: 1 });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2);
    }
  });

  test("should be able to fetch paginated products", async () => {
    for (let i = 1; i <= 22; i++) {
      await productsRepository.create(
        makeProduct({ title: `product ${i}`, categoryTitle: "Electronics" }),
      );
    }

    const result = await sut.execute({
      slug: "Electronics",
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
});
