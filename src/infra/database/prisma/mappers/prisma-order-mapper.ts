import { Prisma, Order as PrismaOrder } from "@prisma/client";
import { OrderStatus } from "src/core/entities/order-status";
import { OrderStatusTracking } from "src/core/entities/order-status-tracking";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Order } from "src/domain/store/enterprise/entities/order";
import { prisma } from "../prisma";
import { PrismaBuyerAddressMapper } from "./prisma-buyer-address-mapper";
import { PrismaOrderProductMapper } from "./prisma-order-product-mapper";

export class PrismaOrderMapper {
  static async toDomain(raw: PrismaOrder): Promise<Order> {
    const orderWithRelations = await prisma.order.findUnique({
      where: { id: raw.id },
      include: {
        buyerAddress: true,
        orderProducts: true,
      },
    });

    if (
      !orderWithRelations?.buyerAddress ||
      !orderWithRelations?.orderProducts
    ) {
      throw new Error("Relations Not Found.");
    }

    const address = orderWithRelations.buyerAddress[0];
    const buyerAddress = PrismaBuyerAddressMapper.toDomain(address);

    const orderProducts = orderWithRelations.orderProducts.map(
      PrismaOrderProductMapper.toDomain,
    );

    const orderStatusTracking: OrderStatusTracking =
      raw.orderStatusTracking as OrderStatusTracking;

    const status: OrderStatus = raw.status as OrderStatus;

    return Order.create(
      {
        buyerId: new UniqueEntityID(raw.buyerId),
        buyerAddress,
        orderProducts,
        orderStatusTracking,
        status,
        trackingCode: raw.trackingCode,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      buyerId: order.buyerId.toString(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
