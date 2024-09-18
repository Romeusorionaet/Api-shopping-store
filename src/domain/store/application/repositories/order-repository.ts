import { Order } from "../../enterprise/entities/order";

export type ConfirmPaymentResponse = {
  buyerId: string;
  publicId: string;
  listOrderTitles: string[];
};

export interface OrderRepository {
  create(order: Order): Promise<void>;
  findByBuyerId(buyerId: string): Promise<Order[]>;
  confirmPayment(orderId: string): Promise<ConfirmPaymentResponse>;
  findById(id: string): Promise<Order | null>;
  removeDuplicatedOrders(buyerId: string, productId: string): Promise<void>;
}
