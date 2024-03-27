import {
  Prisma,
  Order as PrismaOrder,
  BuyerAddress as PrismaBuyerAddress,
  OrderProduct as PrismaOrderProduct,
} from "@prisma/client";

import { OrderStatus } from "src/core/entities/order-status";
import { OrderStatusTracking } from "src/core/entities/order-status-tracking";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Order } from "src/domain/store/enterprise/entities/order";
import { PrismaBuyerAddressMapper } from "./prisma-buyer-address-mapper";
import { PrismaOrderProductMapper } from "./prisma-order-product-mapper";

interface PrismaOrderWithRelations extends PrismaOrder {
  buyerAddress: PrismaBuyerAddress[];
  orderProducts: PrismaOrderProduct[];
}

export class PrismaOrderMapper {
  static async toDomain(raw: PrismaOrderWithRelations): Promise<Order> {
    const address = raw.buyerAddress[0];
    const buyerAddress = PrismaBuyerAddressMapper.toDomain(address);

    const orderProducts = raw.orderProducts.map(
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
