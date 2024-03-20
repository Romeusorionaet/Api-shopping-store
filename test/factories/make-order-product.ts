import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import {
  OrderProduct,
  OrderProductProps,
} from "src/domain/store/enterprise/entities/order-product";

export function makeOrderProduct(
  override: Partial<OrderProductProps> = {},
  id?: UniqueEntityID,
) {
  const orderProduct = OrderProduct.create(
    {
      productId: new UniqueEntityID(),
      discountPercentage: 15,
      basePrice: 200,
      quantity: 2,
      ...override,
    },
    id,
  );

  return orderProduct;
}