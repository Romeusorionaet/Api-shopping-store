import { expect, describe, test, beforeEach } from "vitest";
import { PurchaseOrderUseCase } from "./purchase-order";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { makeBuyerAddress } from "test/factories/make-buyer-address";
import { makeUser } from "test/factories/make-user";
import { makeProduct } from "test/factories/make-product";

let orderRepository: InMemoryOrdersRepository;
let sut: PurchaseOrderUseCase;

describe("Purchase Order", () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrdersRepository();
    sut = new PurchaseOrderUseCase(orderRepository);
  });

  test("should be able to create a purchase order", async () => {
    const user = await makeUser({}, new UniqueEntityID("user-test-id-01"));

    const buyerAddress = await makeBuyerAddress(
      {},
      new UniqueEntityID("purchase-order-buyer-address-test-id"),
    );

    const product = makeProduct({}, new UniqueEntityID("product-test-id-01"));

    const result = await sut.execute({
      buyerId: user.id.toString(),
      productId: product.id.toString(),
      buyerAddress,
      quantity: 2,
    });

    expect(result.isRight()).toEqual(true);

    if (result.isRight()) {
      expect(result.value.order).toEqual(
        expect.objectContaining({
          buyerId: new UniqueEntityID("user-test-id-01"),
          productId: new UniqueEntityID("product-test-id-01"),
        }),
      );

      expect(result.value.order.buyerAddress).toEqual(
        expect.objectContaining({
          id: new UniqueEntityID("purchase-order-buyer-address-test-id"),
        }),
      );
    }
  });

  test("should not be able to create a purchase order without address buyer", async () => {
    const user = await makeUser({}, new UniqueEntityID("user-test-id-02"));

    const product = makeProduct({}, new UniqueEntityID("product-test-id-02"));

    const result = await sut.execute({
      buyerId: user.id.toString(),
      productId: product.id.toString(),
      buyerAddress: {} as any,
      quantity: 2,
    });

    expect(result.isLeft()).toEqual(true);
  });
});
