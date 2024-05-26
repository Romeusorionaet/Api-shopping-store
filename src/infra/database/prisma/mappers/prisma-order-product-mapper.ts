import { Prisma, OrderProduct as PrismaOrderProduct } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { OrderProduct } from "src/domain/store/enterprise/entities/order-product";

export class PrismaOrderProductMapper {
  static toDomain(raw: PrismaOrderProduct): OrderProduct {
    return OrderProduct.create(
      {
        productId: new UniqueEntityID(raw.productId),
        title: raw.title,
        imgUrl: raw.imgUrl,
        basePrice: Number(raw.basePrice),
        discountPercentage: raw.discountPercentage,
        quantity: raw.quantity,
        productColor: raw.productColor,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    orderProduct: OrderProduct,
  ): Prisma.OrderProductUncheckedCreateInput {
    return {
      id: orderProduct.id.toString(),
      productId: orderProduct.productId.toString(),
      title: orderProduct.title,
      imgUrl: orderProduct.imgUrl,
      basePrice: orderProduct.basePrice,
      discountPercentage: orderProduct.discountPercentage,
      quantity: orderProduct.quantity,
      productColor: orderProduct.productColor,
    };
  }
}
