import { OrderRepository } from "src/domain/store/application/repositories/order-repository";
import { Order } from "src/domain/store/enterprise/entities/order";

export class PrismaOrderRepository implements OrderRepository {
  async create(order: Order): Promise<Order> {
    throw new Error("Method not implemented.");
  }

  async findById(buyerId: string): Promise<Order | null> {
    throw new Error("Method not implemented.");
  }
}
