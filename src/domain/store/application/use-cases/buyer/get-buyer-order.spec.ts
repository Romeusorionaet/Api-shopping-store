import { expect, describe, test, beforeEach } from "vitest";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { GetBuyerOrdersUseCase } from "./get-buyer-orders";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { makeOrder } from "test/factories/make-order";
import { makeUser } from "test/factories/make-user";

let ordersRepository: InMemoryOrdersRepository;
let sut: GetBuyerOrdersUseCase;

describe("Get Buyer Orders", () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();

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
