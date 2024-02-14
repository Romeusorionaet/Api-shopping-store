import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/@types/optional";
import dayjs from "dayjs";
import { Entity } from "src/core/entities/entity";

export interface OrderProps {
  productId: UniqueEntityID;
  buyerId: UniqueEntityID;
  buyerAddressId: UniqueEntityID;
  quantity: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class Order extends Entity<OrderProps> {
  get productId() {
    return this.props.productId;
  }

  get buyerId() {
    return this.props.buyerId;
  }

  get buyerAddressId() {
    return this.props.buyerAddressId;
  }

  get quantity() {
    return this.props.quantity;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3;
  }

  static create(props: Optional<OrderProps, "createdAt">, id?: UniqueEntityID) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return order;
  }
}
