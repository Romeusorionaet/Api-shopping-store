import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Order, OrderProps } from "src/domain/store/enterprise/entities/order";
import { makeBuyerAddress } from "./make-buyer-address";
import { OrderStatus } from "src/core/entities/order-status";
import { OrderStatusTracking } from "src/core/entities/order-status-tracking";
import { makeOrderProduct } from "./make-order-product";

export async function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const buyerAddress = makeBuyerAddress();
  const orderProductFirst = makeOrderProduct();
  const orderProductSecond = makeOrderProduct();

  const orderProducts = [];

  orderProducts.push(orderProductFirst);
  orderProducts.push(orderProductSecond);

  const order = Order.create(
    {
      buyerId: new UniqueEntityID(),
      buyerAddress,
      orderProducts,
      status: OrderStatus.WAITING_FOR_PAYMENT,
      trackingCode: "",
      orderStatusTracking: OrderStatusTracking.WAITING,
      ...override,
    },
    id,
  );

  return order;
}
