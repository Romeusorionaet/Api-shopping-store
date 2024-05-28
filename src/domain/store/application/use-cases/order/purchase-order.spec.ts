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
import { makeProduct } from "test/factories/make-product";

let orderRepository: InMemoryOrdersRepository;
let userAddressRepository: InMemoryUsersAddressRepository;
let usersRepository: InMemoryUsersRepository;
let productRepository: InMemoryProductsRepository;
let sut: PurchaseOrderUseCase;

describe("Purchase Order", () => {
  beforeEach(() => {
    productRepository = new InMemoryProductsRepository(orderRepository);

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

    const productFirst = makeProduct({ title: "Notebook" });

    const productSecond = makeProduct({ title: "Cell Phone" });

    productRepository.create(productFirst);
    productRepository.create(productSecond);

    const orderProductFirst = makeOrderProduct({
      title: productFirst.title,
    });

    const orderProductSecond = makeOrderProduct({
      title: productSecond.title,
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
              title: "Notebook",
            }),
            expect.objectContaining({
              title: "Cell Phone",
            }),
          ]),
          status: OrderStatus.WAITING_FOR_PAYMENT,
          orderStatusTracking: OrderStatusTracking.WAITING,
          trackingCode: "",
        }),
      );
    }
  });

  test("should be able to remove duplicated orders of user if not payment", async () => {
    const user = await makeUser({}, new UniqueEntityID("user-test-id-01"));

    await usersRepository.create(user);

    const userAddress = makeUserAddress({
      userId: user.id,
    });

    await userAddressRepository.create(userAddress);

    const product = makeProduct({}, new UniqueEntityID("product-id-01"));

    productRepository.create(product);

    const orderProduct = makeOrderProduct({
      title: product.title,
      productId: product.id,
    });

    const orderProducts = [];

    orderProducts.push(orderProduct);

    await sut.execute({
      buyerId: user.id.toString(),
      orderProducts,
    });

    const result = await sut.execute({
      buyerId: user.id.toString(),
      orderProducts,
    });

    expect(result.isRight()).toEqual(true);

    if (result.isRight()) {
      expect(orderRepository.items).toHaveLength(1);
    }
  });
});
