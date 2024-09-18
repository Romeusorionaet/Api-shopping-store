import { OrderStatus } from "src/core/entities/order-status";
import {
  ConfirmPaymentResponse,
  OrderRepository,
} from "src/domain/store/application/repositories/order-repository";
import { Order } from "src/domain/store/enterprise/entities/order";
import { InMemoryProductsRepository } from "./in-memory-products-repository";
import { InMemoryUsersRepository } from "./in-memory-users-repository";

export class InMemoryOrdersRepository implements OrderRepository {
  public items: Order[] = [];

  constructor(
    private productRepository: InMemoryProductsRepository,
    private usersRepository: InMemoryUsersRepository,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return order;
  }

  async confirmPayment(orderId: string): Promise<ConfirmPaymentResponse> {
    const order = this.items.find((item) => item.id.toString() === orderId);

    if (order) {
      order.status = OrderStatus.PAYMENT_CONFIRMED as OrderStatus;

      this.productRepository.decrementStockQuantity(order.orderProducts);
    }

    const user = this.usersRepository.items.find(
      (user) => user.id === order!.buyerId,
    );

    return {
      buyerId: order!.buyerId.toString(),
      publicId: user!.publicId.toString(),
      listOrderTitles: order!.orderProducts.map((item) => item.title),
    };
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

  async removeDuplicatedOrders(
    buyerId: string,
    productId: string,
  ): Promise<void> {
    this.items = this.items.filter((order) => {
      if (
        order.buyerId.toString() === buyerId &&
        order.status === OrderStatus.WAITING_FOR_PAYMENT &&
        order.orderProducts.some((op) => op.productId.toString() === productId)
      ) {
        return false;
      }
      return true;
    });

    this.items = this.items.filter((order) => order.orderProducts.length > 0);
  }
}
