import { FetchProductsUseCase } from "./fetch-products";
import { makeProduct } from "test/factories/make-product";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";

let productsRepository: InMemoryProductsRepository;
let sut: FetchProductsUseCase;

describe("Fetch Products", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new FetchProductsUseCase(productsRepository);
  });

  test("should be able fetch products", async () => {
    const product1 = makeProduct();
    const product2 = makeProduct();
    const product3 = makeProduct();

    await Promise.all([
      productsRepository.create(product1),
      productsRepository.create(product2),
      productsRepository.create(product3),
    ]);

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBe(true);
    expect(result.value?.products).toHaveLength(3);
  });
});
