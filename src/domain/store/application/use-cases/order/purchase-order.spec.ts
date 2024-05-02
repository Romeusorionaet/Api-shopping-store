import { expect, describe, test, beforeEach } from "vitest";
import { PurchaseOrderUseCase } from "./purchase-order";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { makeUser } from "test/factories/make-user";
import { OrderStatusTracking } from "src/core/entities/order-status-tracking";
import { OrderStatus } from "src/core/entities/order-status";
import { makeOrderProduct } from "test/factories/make-order-product";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryUsersAddressRepository } from "test/repositories/in-memory-users-address-repository";
import { makeUserAddress } from "test/factories/make-user-address";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";

let orderRepository: InMemoryOrdersRepository;
let userAddressRepository: InMemoryUsersAddressRepository;
let usersRepository: InMemoryUsersRepository;
let productRepository: InMemoryProductsRepository;
let sut: PurchaseOrderUseCase;

describe("Purchase Order", () => {
  beforeEach(() => {
    productRepository = new InMemoryProductsRepository();

    orderRepository = new InMemoryOrdersRepository(productRepository);

    userAddressRepository = new InMemoryUsersAddressRepository();

    usersRepository = new InMemoryUsersRepository();

    sut = new PurchaseOrderUseCase(
      orderRepository,
      userAddressRepository,
      usersRepository,
      productRepository,
    );
  });

  test("should be able to create a purchase order", async () => {
    const user = await makeUser({}, new UniqueEntityID("user-test-id-01"));

    await usersRepository.create(user);

    const userAddress = makeUserAddress({
      userId: user.id,
      city: "Canguaretama",
      email: "romeu@gmail.com",
    });

    await userAddressRepository.create(userAddress);

    const orderProductFirst = makeOrderProduct({
      productId: new UniqueEntityID("test-product-id-01"),
    });

    const orderProductSecond = makeOrderProduct({
      productId: new UniqueEntityID("test-product-id-02"),
    });

    const orderProducts = [];

    orderProducts.push(orderProductFirst);
    orderProducts.push(orderProductSecond);

    const result = await sut.execute({
      buyerId: user.id.toString(),
      orderProducts,
    });

    expect(result.isRight()).toEqual(true);

    if (result.isRight()) {
      expect(orderRepository.items[0]).toEqual(
        expect.objectContaining({
          buyerId: new UniqueEntityID("user-test-id-01"),
          buyerAddress: expect.objectContaining({
            city: "Canguaretama",
            email: "romeu@gmail.com",
          }),
          orderProducts: expect.arrayContaining([
            expect.objectContaining({
              productId: new UniqueEntityID("test-product-id-01"),
            }),
            expect.objectContaining({
              productId: new UniqueEntityID("test-product-id-02"),
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
