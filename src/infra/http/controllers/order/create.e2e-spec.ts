import request from "supertest";
import { app } from "src/app";
import { prisma } from "src/infra/database/prisma/prisma";
import { createAndAuthenticateUser } from "test/factories/make-create-and-authenticate-user";
import { BuyerAddressFactory } from "test/factories/make-buyer-address";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { ProductFactory } from "test/factories/make-product";
import { CategoryFactory } from "test/factories/make-category";

describe("Create Order (E2E)", () => {
  let buyerAddressFactory: BuyerAddressFactory;
  let productFactory: ProductFactory;
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    await app.ready();

    buyerAddressFactory = new BuyerAddressFactory();
    productFactory = new ProductFactory();
    categoryFactory = new CategoryFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /order/create", async () => {
    const buyer = await createAndAuthenticateUser(app);
    const buyerId = buyer.user.id;

    const buyerAddress = await buyerAddressFactory.makePrismaBuyerAddress({
      buyerId: new UniqueEntityID(buyerId),
    });

    const category = await categoryFactory.makePrismaCategory({ title: "LG" });

    const productFirst = await productFactory.makePrismaProduct({
      title: "tablet",
      categoryId: category.id,
    });

    const productSeconde = await productFactory.makePrismaProduct({
      title: "notebook",
      categoryId: category.id,
    });

    const orderProductFirst = {
      productId: productFirst.id.toString(),
      discountPercentage: 15,
      basePrice: 200,
      quantity: 2,
    };

    const orderProductSecond = {
      productId: productSeconde.id.toString(),
      discountPercentage: 15,
      basePrice: 200,
      quantity: 2,
    };

    const orderProducts = [];

    orderProducts.push(orderProductFirst);
    orderProducts.push(orderProductSecond);

    const response = await request(app.server).post("/order/create").send({
      buyerId,
      addressId: buyerAddress.id.toString(),
      orderProducts,
    });

    expect(response.statusCode).toEqual(201);

    const orderOnDatabase = await prisma.order.findFirst({
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
  });
});
