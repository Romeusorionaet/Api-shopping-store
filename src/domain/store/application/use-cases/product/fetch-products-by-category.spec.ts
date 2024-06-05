import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeProduct } from "test/factories/make-product";
import { FetchProductsByCategoryUseCase } from "./fetch-products-by-category";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryProductDataStoreRepository } from "test/repositories/in-memory-product-data-store-repository";

let productsRepository: InMemoryProductsRepository;
let productDataStoreRepository: InMemoryProductDataStoreRepository;
let orderRepository: InMemoryOrdersRepository;
let sut: FetchProductsByCategoryUseCase;

describe("Fetch products by category title", () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrdersRepository(productsRepository);

    productDataStoreRepository = new InMemoryProductDataStoreRepository();

    productsRepository = new InMemoryProductsRepository(
      productDataStoreRepository,
      orderRepository,
    );

    sut = new FetchProductsByCategoryUseCase(productsRepository);
  });

  test("should be able to fetch products by category ID", async () => {
    const products1 = makeProduct({
      title: "ball",
      categoryId: new UniqueEntityID("id-01"),
    });
    const products2 = makeProduct({
      title: "cell phone",
      categoryId: new UniqueEntityID("id-01"),
    });
    const products3 = makeProduct({
      title: "notebook",
      categoryId: new UniqueEntityID("id-02"),
    });

    await Promise.all([
      productsRepository.create(products1),
      productsRepository.create(products2),
      productsRepository.create(products3),
    ]);

    const result = await sut.execute({
      categoryId: "id-01",
      page: 1,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2);
    }
  });

  test("should be able to fetch paginated products", async () => {
    for (let i = 1; i <= 22; i++) {
      await productsRepository.create(
        makeProduct({ categoryId: new UniqueEntityID(`id-${i}`) }),
      );
    }

    const result = await sut.execute({
      categoryId: "id-22",
      page: 1,
    });

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(1);
      expect(result.value.products).toEqual([
        expect.objectContaining({ categoryId: new UniqueEntityID("id-22") }),
      ]);
    }
  });
});
