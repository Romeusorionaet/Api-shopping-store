import { Order } from "src/domain/store/enterprise/entities/order";
import { BuyerAddressPresenter } from "./buyer-address-presenter";
import { OrderProductPresenter } from "./order-product-presenter";

export class BuyerOrderPresenter {
  static toHTTP(order: Order) {
    const buyerAddress = BuyerAddressPresenter.toHTTP(order.buyerAddress);
    const orderProducts = order.orderProducts.map(OrderProductPresenter.toHTTP);

    return {
      id: order.id.toString(),
      buyerId: order.buyerId.toString(),
      trackingCode: order.trackingCode,
      orderStatusTracking: order.orderStatusTracking,
      status: order.status,
      buyerAddress,
      orderProducts,
      createAt: order.createdAt,
      updateAt: order.updatedAt,
    };
  }
}
