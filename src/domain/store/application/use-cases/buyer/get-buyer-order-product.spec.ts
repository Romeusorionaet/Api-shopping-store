import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { makeOrder } from "test/factories/make-order";
import { makeUser } from "test/factories/make-user";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { GetBuyerOrderProductUseCase } from "./get-buyer-order-product";
import { makeOrderProduct } from "test/factories/make-order-product";
import { makeProduct } from "test/factories/make-product";
import { InMemoryProductDataStoreRepository } from "test/repositories/in-memory-product-data-store-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";

let ordersRepository: InMemoryOrdersRepository;
let productDataStoreRepository: InMemoryProductDataStoreRepository;
let productRepository: InMemoryProductsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: GetBuyerOrderProductUseCase;

describe("Get Buyer Orders Products", () => {
  beforeEach(() => {
    productDataStoreRepository = new InMemoryProductDataStoreRepository();

    usersRepository = new InMemoryUsersRepository();

    ordersRepository = new InMemoryOrdersRepository(
      productRepository,
      usersRepository,
    );

    productRepository = new InMemoryProductsRepository(
      productDataStoreRepository,
      ordersRepository,
    );

    sut = new GetBuyerOrderProductUseCase(ordersRepository);
  });

  test("can be able get products ordered by buyer", async () => {
    const user = await makeUser(
      {},
      new UniqueEntityID("user-buyer-order-test-id"),
    );

    const product1 = makeProduct({ title: "notebook" });
    const product2 = makeProduct({ title: "tablet" });

    await productRepository.create(product1);
    await productRepository.create(product2);

    const orderProduct = makeOrderProduct({
      title: product1.title,
    });

    const orderProducts = [];

    orderProducts.push(orderProduct);

    const order = await makeOrder({
      buyerId: user.id,
      orderProducts,
    });

    await ordersRepository.create(order);

    const result = await sut.execute({ buyerId: user.id.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.orderProducts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "notebook",
          }),
        ]),
      );
    }
  });
});
