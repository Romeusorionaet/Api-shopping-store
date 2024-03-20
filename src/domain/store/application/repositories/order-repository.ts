import { Order } from "../../enterprise/entities/order";

export interface OrderRepository {
  create(order: Order): Promise<void>;
  findById(buyerId: string): Promise<Order | null>;
}
