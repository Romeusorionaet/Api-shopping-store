import { FetchProductsUseCase } from "./fetch-products";
import { makeProduct } from "test/factories/make-product";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryProductDataStoreRepository } from "test/repositories/in-memory-product-data-store-repository";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";

let productsRepository: InMemoryProductsRepository;
let productDataStoreRepository: InMemoryProductDataStoreRepository;
let orderRepository: InMemoryOrdersRepository;
let usersRepository: InMemoryUsersRepository;
let sut: FetchProductsUseCase;

describe("Fetch Products", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    orderRepository = new InMemoryOrdersRepository(
      productsRepository,
      usersRepository,
    );

    productDataStoreRepository = new InMemoryProductDataStoreRepository();

    productsRepository = new InMemoryProductsRepository(
      productDataStoreRepository,
      orderRepository,
    );

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
