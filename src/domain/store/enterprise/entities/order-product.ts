import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Entity } from "src/core/entities/entity";
import { Optional } from "src/core/@types/optional";

export interface OrderProductProps {
  productId: UniqueEntityID;
  discountPercentage: number;
  basePrice: number;
  quantity: number;
  productColor?: string | null;
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

  get productColor() {
    return this.props.productColor;
  }

  static create(
    props: Optional<OrderProductProps, "productColor">,
    id?: UniqueEntityID,
  ) {
    const orderProduct = new OrderProduct(
      {
        ...props,
        productColor: props.productColor || "default",
      },
      id,
    );

    return orderProduct;
  }
}
