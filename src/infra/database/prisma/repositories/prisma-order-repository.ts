import { OrderRepository } from "src/domain/store/application/repositories/order-repository";
import { Order } from "src/domain/store/enterprise/entities/order";
import { prisma } from "../prisma";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { PrismaOrderProductMapper } from "../mappers/prisma-order-product-mapper";

export class PrismaOrderRepository implements OrderRepository {
  async create(order: Order): Promise<void> {
    const dataOrder = PrismaOrderMapper.toPrisma(order);

    const dataOrderProducts = order.orderProducts.map(
      PrismaOrderProductMapper.toPrisma,
    );

    await prisma.order.create({
      data: {
        id: dataOrder.id,
        buyerId: dataOrder.buyerId,
        createdAt: dataOrder.createdAt,
        updatedAt: dataOrder.updatedAt,
        orderProducts: {
          createMany: {
            data: dataOrderProducts,
          },
        },
      },
    });
  }

  async findById(buyerId: string): Promise<Order | null> {
    const order = await prisma.order.findFirst({
      where: {
        buyerId,
      },
    });

    if (!order) {
      return null;
    }

    return PrismaOrderMapper.toDomain(order);
  }
}
