import { app } from "src/app";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import request from "supertest";
import { makeBuyerAddress } from "test/factories/make-buyer-address";
import { CategoryFactory } from "test/factories/make-category";
import { CreateAndAuthenticateUserWithTokensFactory } from "test/factories/make-create-and-authenticate-user";
import { OrderFactory } from "test/factories/make-order";
import { makeOrderProduct } from "test/factories/make-order-product";
import { ProductFactory } from "test/factories/make-product";
import { UserAddressFactory } from "test/factories/make-user-address";

describe("Get buyer order product (E2E)", () => {
  let userAddressFactory: UserAddressFactory;
  let orderFactory: OrderFactory;
  let categoryFactory: CategoryFactory;
  let productFactory: ProductFactory;
  let createAndAuthenticateUserWithTokensFactory: CreateAndAuthenticateUserWithTokensFactory;

  beforeAll(async () => {
    await app.ready();

    userAddressFactory = new UserAddressFactory();
    orderFactory = new OrderFactory();
    productFactory = new ProductFactory();
    categoryFactory = new CategoryFactory();
    createAndAuthenticateUserWithTokensFactory =
      new CreateAndAuthenticateUserWithTokensFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /buyer/order/products", async () => {
    const { accessToken, user } =
      await createAndAuthenticateUserWithTokensFactory.makePrismaCreateAndAuthenticateUserWithTokens(
        app,
      );

    const { user: otherUser } =
      await createAndAuthenticateUserWithTokensFactory.makePrismaCreateAndAuthenticateUserWithTokens(
        app,
      );

    const buyerId = user.id;
    const otherBuyerId = otherUser.id;

    const userAddress = await userAddressFactory.makePrismaUserAddress({
      userId: new UniqueEntityID(buyerId),
      city: "Canguaretama",
    });

    const createBuyerAddress = () => {
      return makeBuyerAddress({
        buyerId: userAddress.userId,
        cep: userAddress.cep,
        city: userAddress.city,
        complement: userAddress.complement,
        email: userAddress.email,
        houseNumber: userAddress.houseNumber,
        neighborhood: userAddress.neighborhood,
        phoneNumber: userAddress.phoneNumber,
        street: userAddress.street,
        uf: userAddress.uf,
        username: userAddress.username,
      });
    };

    const category = await categoryFactory.makePrismaCategory({
      title: "category test 01",
    });

    const product = await productFactory.makePrismaProduct({
      categoryId: category.id,
      categoryTitle: category.title,
    });

    const orderProductFirstBuyer = makeOrderProduct(
      { productId: product.id },
      new UniqueEntityID("order-product-id-01"),
    );

    const orderProductOtherBuyer = makeOrderProduct(
      { productId: product.id },
      new UniqueEntityID("order-product-id-02"),
    );

    const orderProductsFirstBuyer = [];
    const orderProductsOtherBuyer = [];

    orderProductsFirstBuyer.push(orderProductFirstBuyer);
    orderProductsOtherBuyer.push(orderProductOtherBuyer);

    const buyerAddressFirstBuyer = createBuyerAddress();
    const buyerAddressOtherBuyer = createBuyerAddress();

    await Promise.all([
      orderFactory.makePrismaOrder({
        buyerId: new UniqueEntityID(buyerId),
        buyerAddress: buyerAddressFirstBuyer,
        orderProducts: orderProductsFirstBuyer,
      }),

      orderFactory.makePrismaOrder({
        buyerId: new UniqueEntityID(otherBuyerId),
        buyerAddress: buyerAddressOtherBuyer,
        orderProducts: orderProductsOtherBuyer,
      }),
    ]);

    const result = await request(app.server)
      .get("/buyer/order/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .query({ page: 1 });

    expect(result.statusCode).toBe(200);
    expect(result.body.products).toHaveLength(1);
  });
});
