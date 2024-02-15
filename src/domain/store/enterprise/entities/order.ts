import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/@types/optional";
import dayjs from "dayjs";
import { Entity } from "src/core/entities/entity";
import { BuyerAddress } from "./buyer-address";

export interface OrderProps {
  productId: UniqueEntityID;
  buyerId: UniqueEntityID;
  buyerAddress: BuyerAddress;
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

  get buyerAddress() {
    return this.props.buyerAddress;
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
