import { faker } from "@faker-js/faker";
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
      title: faker.lorem.word.toString(),
      imgUrl: faker.image.toString(),
      discountPercentage: 15,
      basePrice: 200,
      quantity: 2,
      productColor: faker.color.human(),
      ...override,
    },
    id,
  );

  return orderProduct;
}
