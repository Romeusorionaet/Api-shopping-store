import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Entity } from "src/core/entities/entity";

export interface OrderProductProps {
  productId: UniqueEntityID;
  title: string;
  imgUrl: string;
  discountPercentage: number;
  basePrice: number;
  quantity: number;
  colorList: string[];
}

export class OrderProduct extends Entity<OrderProductProps> {
  get productId() {
    return this.props.productId;
  }

  get title() {
    return this.props.title;
  }

  get imgUrl() {
    return this.props.imgUrl;
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

  get colorList() {
    return this.props.colorList;
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
