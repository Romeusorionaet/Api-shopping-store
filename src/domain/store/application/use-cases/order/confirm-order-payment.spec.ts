import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { OrderStatus } from "src/core/entities/order-status";
import { ConfirmOrderPaymentUseCase } from "./confirm-order-payment";
import { makeOrder } from "test/factories/make-order";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeOrderProduct } from "test/factories/make-order-product";
import { makeProduct } from "test/factories/make-product";
import { InMemoryProductDataStoreRepository } from "test/repositories/in-memory-product-data-store-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";

let orderRepository: InMemoryOrdersRepository;
let productDataStoreRepository: InMemoryProductDataStoreRepository;
let productRepository: InMemoryProductsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: ConfirmOrderPaymentUseCase;

describe("Confirm Order Payment", () => {
  beforeEach(() => {
    productDataStoreRepository = new InMemoryProductDataStoreRepository();

    usersRepository = new InMemoryUsersRepository();

    productRepository = new InMemoryProductsRepository(
      productDataStoreRepository,
      orderRepository,
    );

    orderRepository = new InMemoryOrdersRepository(
      productRepository,
      usersRepository,
    );

    sut = new ConfirmOrderPaymentUseCase(orderRepository);
  });

  test("should be able to confirm a order payment", async () => {
    const user = await makeUser({}, new UniqueEntityID("test-buyer-id"));

    await usersRepository.create(user);

    const order = await makeOrder(
      {
        buyerId: user.id,
      },
      new UniqueEntityID("test-order-id"),
    );

    await orderRepository.create(order);

    const userSaved = await usersRepository.findById(order.buyerId.toString());

    const result = await sut.execute({ orderId: order.id.toString() });

    expect(result.isRight()).toEqual(true);

    if (result.isRight()) {
      expect(result.value).toEqual(
        expect.objectContaining({
          publicId: userSaved?.publicId.toString(),
          buyerId: order.buyerId.toString(),
          listOrderTitles: order.orderProducts.map((order) => order.title),
        }),
      );

      expect(orderRepository.items[0]).toEqual(
        expect.objectContaining({
          buyerId: new UniqueEntityID("test-buyer-id"),
          status: OrderStatus.PAYMENT_CONFIRMED,
        }),
      );
    }
  });

  test("should be able to decrement product stock quantity", async () => {
    const user = await makeUser({}, new UniqueEntityID("test-buyer-id-02"));

    await usersRepository.create(user);

    const productFirst = makeProduct({
      title: "Cell Phone",
      stockQuantity: 10,
    });

    const productSecond = makeProduct({
      title: "Notebook",
      stockQuantity: 10,
    });

    productRepository.create(productFirst);
    productRepository.create(productSecond);

    const orderProductFirst = makeOrderProduct({
      title: productFirst.title,
      quantity: 5,
    });

    const orderProductSecond = makeOrderProduct({
      title: productSecond.title,
      quantity: 1,
    });

    const orderProducts = [];

    orderProducts.push(orderProductFirst);
    orderProducts.push(orderProductSecond);

    const order = await makeOrder({
      buyerId: user.id,
      orderProducts,
    });

    orderRepository.create(order);

    const result = await sut.execute({ orderId: order.id.toString() });

    expect(result.isRight()).toEqual(true);
  });
});
