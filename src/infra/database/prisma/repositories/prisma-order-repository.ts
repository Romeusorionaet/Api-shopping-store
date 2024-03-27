import { OrderRepository } from "src/domain/store/application/repositories/order-repository";
import { Order } from "src/domain/store/enterprise/entities/order";
import { prisma } from "../prisma";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { PrismaOrderProductMapper } from "../mappers/prisma-order-product-mapper";
import { PrismaBuyerAddressMapper } from "../mappers/prisma-buyer-address-mapper";

export class PrismaOrderRepository implements OrderRepository {
  async create(order: Order): Promise<void> {
    const dataOrder = PrismaOrderMapper.toPrisma(order);

    const dataOrderProducts = order.orderProducts.map(
      PrismaOrderProductMapper.toPrisma,
    );
    const dataBuyerAddress = PrismaBuyerAddressMapper.toPrisma(
      order.buyerAddress,
    );

    await prisma.order.create({
      data: {
        id: dataOrder.id,
        buyerId: dataOrder.buyerId,
        createdAt: dataOrder.createdAt,
        updatedAt: dataOrder.updatedAt,
        buyerAddress: {
          createMany: {
            data: dataBuyerAddress,
          },
        },
        orderProducts: {
          createMany: {
            data: dataOrderProducts,
          },
        },
      },
    });
  }

  async findByBuyerId(buyerId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: {
        buyerId,
      },
      include: {
        buyerAddress: true,
        orderProducts: true,
      },
    });

    const mappedOrders = await Promise.all(
      orders.map(PrismaOrderMapper.toDomain),
    );
    return mappedOrders;
  }
}
