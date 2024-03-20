import { expect, describe, test, beforeEach } from "vitest";
import { PurchaseOrderUseCase } from "./purchase-order";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { makeUser } from "test/factories/make-user";
import { InMemoryBuyerAddressRepository } from "test/repositories/in-memory-buyer-address-repository";
import { makeBuyerAddress } from "test/factories/make-buyer-address";
import { OrderStatusTracking } from "src/core/entities/order-status-tracking";
import { OrderStatus } from "src/core/entities/order-status";
import { makeOrderProduct } from "test/factories/make-order-product";

let orderRepository: InMemoryOrdersRepository;
let buyerAddressRepository: InMemoryBuyerAddressRepository;
let sut: PurchaseOrderUseCase;

describe("Purchase Order", () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrdersRepository();

    buyerAddressRepository = new InMemoryBuyerAddressRepository();

    sut = new PurchaseOrderUseCase(orderRepository, buyerAddressRepository);
  });

  test("should be able to create a purchase order", async () => {
    const user = await makeUser({}, new UniqueEntityID("user-test-id-01"));

    const buyerAddress = makeBuyerAddress(
      {},
      new UniqueEntityID("buyer-address-id-01"),
    );

    const orderProductFirst = makeOrderProduct(
      {},
      new UniqueEntityID("order-product-id-01"),
    );

    const orderProductSecond = makeOrderProduct(
      {},
      new UniqueEntityID("order-product-id-02"),
    );

    const orderProducts = [];

    orderProducts.push(orderProductFirst);
    orderProducts.push(orderProductSecond);

    await buyerAddressRepository.create(buyerAddress);

    const result = await sut.execute({
      buyerId: user.id.toString(),
      addressId: buyerAddress.id.toString(),
      orderProducts,
    });

    expect(result.isRight()).toEqual(true);

    if (result.isRight()) {
      expect(orderRepository.items[0]).toEqual(
        expect.objectContaining({
          buyerId: new UniqueEntityID("user-test-id-01"),
          buyerAddress: expect.objectContaining({
            id: new UniqueEntityID("buyer-address-id-01"),
          }),
          orderProducts: expect.arrayContaining([
            expect.objectContaining({
              id: new UniqueEntityID("order-product-id-01"),
            }),
            expect.objectContaining({
              id: new UniqueEntityID("order-product-id-02"),
            }),
          ]),
          status: OrderStatus.WAITING_FOR_PAYMENT,
          orderStatusTracking: OrderStatusTracking.WAITING,
          trackingCode: "",
        }),
      );
    }
  });
});
