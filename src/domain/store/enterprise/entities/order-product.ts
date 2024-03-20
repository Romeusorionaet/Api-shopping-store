import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Entity } from "src/core/entities/entity";

export interface OrderProductProps {
  productId: UniqueEntityID;
  discountPercentage: number;
  basePrice: number;
  quantity: number;
}

export class OrderProduct extends Entity<OrderProductProps> {
  get productId() {
    return this.props.productId;
  }

  get discountPercentage() {
    return this.props.discountPercentage;
  }

  get basePrice() {
    return this.props.basePrice;
  }

  get quantity() {
    return this.props.quantity;
  }

  static create(props: OrderProductProps, id?: UniqueEntityID) {
    const orderProduct = new OrderProduct(
      {
        ...props,
      },
      id,
    );

    return orderProduct;
  }
}
