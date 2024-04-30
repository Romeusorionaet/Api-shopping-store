import { OrderStatus } from "src/core/entities/order-status";
import { OrderRepository } from "src/domain/store/application/repositories/order-repository";
import { Order } from "src/domain/store/enterprise/entities/order";
import { InMemoryProductsRepository } from "./in-memory-products-repository";

export class InMemoryOrdersRepository implements OrderRepository {
  public items: Order[] = [];

  constructor(private productRepository: InMemoryProductsRepository) {}

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return order;
  }

  async confirmPayment(orderId: string): Promise<void> {
    const order = this.items.find((item) => item.id.toString() === orderId);

    if (order) {
      order.status = OrderStatus.PAYMENT_CONFIRMED as OrderStatus;

      this.productRepository.decrementStockQuantity(order.orderProducts);
    }
  }

  async create(order: Order): Promise<void> {
    this.items.push(order);
  }

  async findByBuyerId(buyerId: string): Promise<Order[]> {
    const orders = this.items.filter(
      (item) => item.buyerId.toString() === buyerId,
    );

    return orders;
  }
}
