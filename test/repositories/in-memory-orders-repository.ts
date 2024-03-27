import { OrderRepository } from "src/domain/store/application/repositories/order-repository";
import { Order } from "src/domain/store/enterprise/entities/order";

export class InMemoryOrdersRepository implements OrderRepository {
  public items: Order[] = [];

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
