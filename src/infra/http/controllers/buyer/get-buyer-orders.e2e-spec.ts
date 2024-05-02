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

describe("Get buyer orders (E2E)", () => {
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

  test("[GET] /buyer/orders", async () => {
    const { accessToken, user } =
      await createAndAuthenticateUserWithTokensFactory.makePrismaCreateAndAuthenticateUserWithTokens(
        app,
      );

    const buyerId = user.id;

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

    const orderProductFirst = makeOrderProduct({
      productId: product.id,
      basePrice: 150,
    });
    const orderProductSecond = makeOrderProduct({
      productId: product.id,
      basePrice: 150,
    });

    const orderProducts = [];

    orderProducts.push(orderProductFirst);
    orderProducts.push(orderProductSecond);

    const buyerAddressFirst = createBuyerAddress();
    const buyerAddressSecond = createBuyerAddress();

    await Promise.all([
      orderFactory.makePrismaOrder({
        buyerId: new UniqueEntityID(buyerId),
        buyerAddress: buyerAddressFirst,
        orderProducts,
      }),

      orderFactory.makePrismaOrder({
        buyerId: new UniqueEntityID(buyerId),
        buyerAddress: buyerAddressSecond,
        orderProducts,
      }),
    ]);

    const result = await request(app.server)
      .get(`/buyer/orders/${buyerId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(200);

    expect(result.body.orders).toEqual(
      expect.arrayContaining([expect.objectContaining({ buyerId })]),
    );

    expect(result.body.orders).toHaveLength(2);
    expect(result.body.orders[0]).toEqual(
      expect.objectContaining({
        buyerAddress: expect.objectContaining({
          buyerId,
          city: "Canguaretama",
        }),
      }),
    );

    expect(result.body.orders[0]).toEqual(
      expect.objectContaining({
        orderProducts: expect.arrayContaining([
          expect.objectContaining({
            productId: product.id.toString(),
            basePrice: 150,
          }),
        ]),
      }),
    );
  });
});
