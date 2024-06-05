import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { GetBuyerOrdersUseCase } from "./get-buyer-orders";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { makeOrder } from "test/factories/make-order";
import { makeUser } from "test/factories/make-user";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemoryProductDataStoreRepository } from "test/repositories/in-memory-product-data-store-repository";

let ordersRepository: InMemoryOrdersRepository;
let productDataStoreRepository: InMemoryProductDataStoreRepository;
let productRepository: InMemoryProductsRepository;
let sut: GetBuyerOrdersUseCase;

describe("Get Buyer Orders", () => {
  beforeEach(() => {
    productDataStoreRepository = new InMemoryProductDataStoreRepository();

    productRepository = new InMemoryProductsRepository(
      productDataStoreRepository,
      ordersRepository,
    );

    ordersRepository = new InMemoryOrdersRepository(productRepository);

    sut = new GetBuyerOrdersUseCase(ordersRepository);
  });

  test("should be able to get a buyer orders by buyerId", async () => {
    const user = await makeUser(
      {},
      new UniqueEntityID("user-buyer-order-test-id"),
    );

    const order = await makeOrder({
      buyerId: user.id,
    });

    await ordersRepository.create(order);

    const result = await sut.execute({ buyerId: order.buyerId.toString() });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.orders).toEqual([
        expect.objectContaining({
          buyerId: new UniqueEntityID("user-buyer-order-test-id"),
        }),
      ]);
    }
  });
});
