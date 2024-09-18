import {
  ConfirmPaymentResponse,
  OrderRepository,
} from "src/domain/store/application/repositories/order-repository";
import { Order } from "src/domain/store/enterprise/entities/order";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { PrismaOrderProductMapper } from "../mappers/prisma-order-product-mapper";
import { PrismaBuyerAddressMapper } from "../mappers/prisma-buyer-address-mapper";
import { PrismaProductRepository } from "./prisma-product-repository";
import { ProductRatingRepository } from "src/domain/store/application/repositories/product-rating-repository";
import { OrderStatus } from "src/core/entities/order-status";

export class PrismaOrderRepository implements OrderRepository {
  constructor(
    private productRepository: PrismaProductRepository,
    private productRatingRepository: ProductRatingRepository,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderProducts: true,
        buyerAddress: true,
      },
    });

    if (!order) {
      return null;
    }
    return PrismaOrderMapper.toDomain(order);
  }

  async confirmPayment(orderId: string): Promise<ConfirmPaymentResponse> {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PAYMENT_CONFIRMED,
      },
      include: {
        orderProducts: true,
        user: {
          select: {
            publicId: true,
          },
        },
      },
    });

    const orderProducts = order.orderProducts.map(
      PrismaOrderProductMapper.toDomain,
    );

    this.productRepository.decrementStockQuantity(orderProducts);
    orderProducts.map((orderProduct) =>
      this.productRatingRepository.addStarToProduct(
        orderProduct.productId.toString(),
      ),
    );

    return {
      buyerId: order.buyerId,
      publicId: order.user.publicId,
      listOrderTitles: order.orderProducts.map((item) => item.title),
    };
  }

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

  async removeDuplicatedOrders(
    buyerId: string,
    productId: string,
  ): Promise<void> {
    await prisma.order.deleteMany({
      where: {
        buyerId,
        status: OrderStatus.WAITING_FOR_PAYMENT,
        orderProducts: {
          some: {
            productId,
          },
        },
      },
    });

    await prisma.order.deleteMany({
      where: {
        orderProducts: {
          none: {},
        },
      },
    });
  }
}
