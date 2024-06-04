import { Order } from "src/domain/store/enterprise/entities/order";
import { BuyerAddressPresenter } from "./buyer-address-presenter";
import { OrderProductPresenter } from "./order-product-presenter";

export class BuyerOrderPresenter {
  static toHTTP(order: Order) {
    const buyerAddress = BuyerAddressPresenter.toHTTP(order.buyerAddress);
    const orderProducts = order.orderProducts.map(OrderProductPresenter.toHTTP);

    return {
      id: order.id.toString(),
      trackingCode: order.trackingCode,
      orderStatusTracking: order.orderStatusTracking,
      status: order.status,
      buyerAddress,
      orderProducts,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
