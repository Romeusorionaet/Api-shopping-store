import { makeProduct } from "test/factories/make-product";
import { RemoveProductUseCase } from "./remove-product";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemoryProductDataStoreRepository } from "test/repositories/in-memory-product-data-store-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";

let productsRepository: InMemoryProductsRepository;
let productDataStoreRepository: InMemoryProductDataStoreRepository;
let orderRepository: InMemoryOrdersRepository;
let usersRepository: InMemoryUsersRepository;
let sut: RemoveProductUseCase;

describe("Remove Product", () => {
  beforeEach(() => {
    productDataStoreRepository = new InMemoryProductDataStoreRepository();

    usersRepository = new InMemoryUsersRepository();

    orderRepository = new InMemoryOrdersRepository(
      productsRepository,
      usersRepository,
    );

    productsRepository = new InMemoryProductsRepository(
      productDataStoreRepository,
      orderRepository,
    );

    sut = new RemoveProductUseCase(productsRepository);
  });

  test("should be able to remove the product", async () => {
    const product = makeProduct();

    await productsRepository.create(product);

    const result = await sut.execute({ id: product.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(productsRepository.dataStore.items).toHaveLength(0);
  });
});
