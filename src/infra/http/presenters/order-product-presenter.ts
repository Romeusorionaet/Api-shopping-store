import { OrderProduct } from "src/domain/store/enterprise/entities/order-product";

export class OrderProductPresenter {
  static toHTTP(orderProduct: OrderProduct) {
    return {
      id: orderProduct.id.toString(),
      productId: orderProduct.productId.toString(),
      title: orderProduct.title,
      imgUrl: orderProduct.imgUrl,
      basePrice: orderProduct.basePrice,
      discountPercentage: orderProduct.discountPercentage,
      quantity: orderProduct.quantity,
      colorList: orderProduct.colorList,
    };
  }
}
