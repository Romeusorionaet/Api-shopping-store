import { expect, describe, test, beforeEach } from "vitest";
import { PurchaseOrderUseCase } from "./purchase-order";
import { InMemoryOrdersRepository } from "src/test/repositories/in-memory-orders-repository";
import { MakeUser } from "src/test/factories/make-user";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { MakeProduct } from "src/test/factories/make-product";
import { MakeBuyerAddress } from "src/test/factories/make-buyer-address";

let orderRepository: InMemoryOrdersRepository;
let sut: PurchaseOrderUseCase;

describe("Purchase Order", () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrdersRepository();
    sut = new PurchaseOrderUseCase(orderRepository);
  });

  test("should be able to create a purchase order", async () => {
    const user = await MakeUser({}, new UniqueEntityID("user-test-id-01"));

    const buyerAddress = await MakeBuyerAddress(
      {},
      new UniqueEntityID("purchase-order-buyer-address-test-id"),
    );

    const product = MakeProduct({}, new UniqueEntityID("product-test-id-01"));

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
});
