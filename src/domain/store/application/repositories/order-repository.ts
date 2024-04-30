import { Order } from "../../enterprise/entities/order";

export interface OrderRepository {
  create(order: Order): Promise<void>;
  findByBuyerId(buyerId: string): Promise<Order[]>;
  confirmPayment(orderId: string): Promise<void>;
  findById(id: string): Promise<Order | null>;
}
