import request from "supertest";
import { app } from "src/app";
import { prisma } from "src/infra/database/prisma/prisma";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { ProductFactory } from "test/factories/make-product";
import { CategoryFactory } from "test/factories/make-category";
import { UserAddressFactory } from "test/factories/make-user-address";
import { CreateAndAuthenticateUserWithTokensFactory } from "test/factories/make-create-and-authenticate-user";

describe("Create Order (E2E)", () => {
  let userAddressFactory: UserAddressFactory;
  let productFactory: ProductFactory;
  let categoryFactory: CategoryFactory;
  let createAndAuthenticateUserWithTokensFactory: CreateAndAuthenticateUserWithTokensFactory;

  beforeAll(async () => {
    await app.ready();

    userAddressFactory = new UserAddressFactory();
    productFactory = new ProductFactory();
    categoryFactory = new CategoryFactory();
    createAndAuthenticateUserWithTokensFactory =
      new CreateAndAuthenticateUserWithTokensFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /order/create", async () => {
    const { user, accessToken } =
      await createAndAuthenticateUserWithTokensFactory.makePrismaCreateAndAuthenticateUserWithTokens(
        app,
      );
    const buyerId = user.id;

    await userAddressFactory.makePrismaUserAddress({
      userId: new UniqueEntityID(buyerId),
      city: "Canguaretama",
    });

    const category = await categoryFactory.makePrismaCategory({ title: "LG" });

    const productFirst = await productFactory.makePrismaProduct({
      title: "tablet",
      categoryId: category.id,
      stockQuantity: 10,
    });

    const productSeconde = await productFactory.makePrismaProduct({
      title: "notebook",
      categoryId: category.id,
      stockQuantity: 10,
    });

    const orderProductFirst = {
      productId: productFirst.id.toString(),
      discountPercentage: 15,
      basePrice: 200,
      quantity: 5,
      title: "tablet",
      description: "lorem description for product test e2e",
    };

    const orderProductSecond = {
      productId: productSeconde.id.toString(),
      discountPercentage: 15,
      basePrice: 200,
      quantity: 2,
      title: "notebook",
      description: "lorem description for product test e2e",
    };

    const orderProducts = [];

    orderProducts.push(orderProductFirst);
    orderProducts.push(orderProductSecond);

    const response = await request(app.server)
      .post("/order/create")
      .send({
        buyerId,
        orderProducts,
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        checkoutUrl: expect.any(String),
        successUrlWithSessionId: expect.any(String),
      }),
    );

    const orderOnDatabase = await prisma.order.findMany({
      where: {
        buyerId,
      },
      include: {
        buyerAddress: true,
        orderProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    expect(orderOnDatabase).toBeTruthy();
    expect(orderOnDatabase[0].buyerAddress).toEqual([
      expect.objectContaining({
        city: "Canguaretama",
      }),
    ]);
    expect(orderOnDatabase[0].orderProducts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product: expect.objectContaining({ title: "tablet" }),
        }),

        expect.objectContaining({
          product: expect.objectContaining({ title: "notebook" }),
        }),
      ]),
    );
  });
});
