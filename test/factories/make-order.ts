import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Order, OrderProps } from "src/domain/store/enterprise/entities/order";
import { makeBuyerAddress } from "./make-buyer-address";
import { OrderStatus } from "src/core/entities/order-status";
import { OrderStatusTracking } from "src/core/entities/order-status-tracking";
import { makeOrderProduct } from "./make-order-product";
import { prisma } from "src/infra/database/prisma/prisma";
import { PrismaOrderMapper } from "src/infra/database/prisma/mappers/prisma-order-mapper";
import { PrismaOrderProductMapper } from "src/infra/database/prisma/mappers/prisma-order-product-mapper";
import { PrismaBuyerAddressMapper } from "src/infra/database/prisma/mappers/prisma-buyer-address-mapper";

export async function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const dataBuyerAddress = makeBuyerAddress();

  const orderProductFirst = makeOrderProduct();
  const orderProductSecond = makeOrderProduct();

  const dataOrderProducts = [];

  dataOrderProducts.push(orderProductFirst);
  dataOrderProducts.push(orderProductSecond);

  const order = Order.create(
    {
      buyerId: new UniqueEntityID(),
      buyerAddress: dataBuyerAddress,
      orderProducts: dataOrderProducts,
      status: OrderStatus.WAITING_FOR_PAYMENT,
      trackingCode: "",
      orderStatusTracking: OrderStatusTracking.WAITING,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  );

  return order;
}

export class OrderFactory {
  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = await makeOrder(data);

    const dataOrder = PrismaOrderMapper.toPrisma(order);

    const buyerAddress = PrismaBuyerAddressMapper.toPrisma(order.buyerAddress);
    const orderProducts = order.orderProducts.map(
      PrismaOrderProductMapper.toPrisma,
    );

    await prisma.order.create({
      data: {
        id: dataOrder.id,
        buyerId: dataOrder.buyerId,
        createdAt: dataOrder.createdAt,
        updatedAt: dataOrder.updatedAt,
        buyerAddress: {
          createMany: {
            data: buyerAddress,
          },
        },
        orderProducts: {
          createMany: {
            data: orderProducts,
          },
        },
      },
    });

    return order;
  }
}
