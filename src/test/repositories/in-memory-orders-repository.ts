import { OrderRepository } from "src/domain/store/application/repositories/order-repository";
import { Order } from "src/domain/store/enterprise/entities/order";

export class InMemoryOrdersRepository implements OrderRepository {
  public items: Order[] = [];

  async create(order: Order): Promise<Order> {
    this.items.push(order);

    return order;
  }
}
