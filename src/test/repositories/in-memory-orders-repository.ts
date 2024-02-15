import { OrderRepository } from "src/domain/store/application/repositories/order-repository";
import { Order } from "src/domain/store/enterprise/entities/order";

export class InMemoryOrdersRepository implements OrderRepository {
  public items: Order[] = [];

  async findById(buyerId: string): Promise<Order | null> {
    const order = this.items.find(
      (item) => item.buyerId.toString() === buyerId,
    );

    if (!order) {
      return null;
    }

    return order;
  }

  async create(order: Order): Promise<Order> {
    this.items.push(order);

    return order;
  }
}
