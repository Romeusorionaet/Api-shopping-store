import { expect, describe, test, beforeEach } from "vitest";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { OrderStatus } from "src/core/entities/order-status";
import { ConfirmOrderPaymentUseCase } from "./confirm-order-payment";
import { makeOrder } from "test/factories/make-order";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeOrderProduct } from "test/factories/make-order-product";
import { makeProduct } from "test/factories/make-product";

let orderRepository: InMemoryOrdersRepository;
let productRepository: InMemoryProductsRepository;
let sut: ConfirmOrderPaymentUseCase;

describe("Confirm Order Payment", () => {
  beforeEach(() => {
    productRepository = new InMemoryProductsRepository();

    orderRepository = new InMemoryOrdersRepository(productRepository);

    sut = new ConfirmOrderPaymentUseCase(orderRepository);
  });

  test("should be able to confirm a order payment", async () => {
    const order = await makeOrder(
      {
        buyerId: new UniqueEntityID("test-buyer-id"),
      },
      new UniqueEntityID("test-order-id"),
    );

    await orderRepository.create(order);

    const result = await sut.execute({ orderId: order.id.toString() });

    expect(result.isRight()).toEqual(true);

    if (result.isRight()) {
      expect(orderRepository.items[0]).toEqual(
        expect.objectContaining({
          buyerId: new UniqueEntityID("test-buyer-id"),
          status: OrderStatus.PAYMENT_CONFIRMED,
        }),
      );
    }
  });

  test("should be able to decrement product stock quantity", async () => {
    const productFirst = makeProduct(
      {
        title: "Cell Phnoe",
        stockQuantity: 10,
      },
      new UniqueEntityID("cell-phone-id-01"),
    );

    const productSecond = makeProduct(
      {
        title: "Notebook",
        stockQuantity: 10,
      },
      new UniqueEntityID("notebook-id-01"),
    );

    productRepository.create(productFirst);
    productRepository.create(productSecond);

    const orderProductFirst = makeOrderProduct({
      productId: productFirst.id,
      quantity: 5,
    });

    const orderProductSecond = makeOrderProduct({
      productId: productSecond.id,
      quantity: 1,
    });

    const orderProducts = [];

    orderProducts.push(orderProductFirst);
    orderProducts.push(orderProductSecond);

    const order = await makeOrder({
      buyerId: new UniqueEntityID("test-buyer-id-01"),
      orderProducts,
    });

    orderRepository.create(order);

    const result = await sut.execute({ orderId: order.id.toString() });

    expect(result.isRight()).toEqual(true);
  });
});
