import { Order } from "../../enterprise/entities/order";

export interface OrderRepository {
  create(order: Order): Promise<Order>;
}
