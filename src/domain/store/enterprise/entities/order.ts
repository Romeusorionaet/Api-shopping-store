import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/@types/optional";
import { Entity } from "src/core/entities/entity";
import { BuyerAddress } from "./buyer-address";
import { OrderStatusTracking } from "src/core/entities/order-status-tracking";
import { OrderStatus } from "src/core/entities/order-status";
import { OrderProduct } from "./order-product";
import dayjs from "dayjs";

export interface OrderProps {
  buyerId: UniqueEntityID;
  trackingCode?: string | null;
  orderStatusTracking?: OrderStatusTracking | null;
  status?: OrderStatus | null;
  buyerAddress: BuyerAddress;
  orderProducts: OrderProduct[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Order extends Entity<OrderProps> {
  get buyerId() {
    return this.props.buyerId;
  }

  get trackingCode() {
    return this.props.trackingCode;
  }

  get orderStatusTracking() {
    return this.props.orderStatusTracking;
  }

  get status() {
    return this.props.status;
  }

  get buyerAddress() {
    return this.props.buyerAddress;
  }

  get orderProducts() {
    return this.props.orderProducts;
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

  static create(
    props: Optional<
      OrderProps,
      "createdAt" | "status" | "trackingCode" | "orderStatusTracking"
    >,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: (props.status = OrderStatus.WAITING_FOR_PAYMENT),
        trackingCode: (props.trackingCode = ""),
        orderStatusTracking: (props.orderStatusTracking =
          OrderStatusTracking.WAITING),
      },
      id,
    );
    return order;
  }
}
