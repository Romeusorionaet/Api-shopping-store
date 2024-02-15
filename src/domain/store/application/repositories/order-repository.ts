import { Order } from "../../enterprise/entities/order";

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(buyerId: string): Promise<Order | null>;
}
