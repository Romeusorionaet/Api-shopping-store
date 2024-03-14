import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Order, OrderProps } from "src/domain/store/enterprise/entities/order";
import { makeBuyerAddress } from "./make-buyer-address";

export async function MakeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const fakeBuyerAddress = await makeBuyerAddress();

  const order = Order.create(
    {
      buyerAddress: fakeBuyerAddress,
      buyerId: new UniqueEntityID(),
      productId: new UniqueEntityID(),
      quantity: 2,
      ...override,
    },
    id,
  );

  return order;
}
