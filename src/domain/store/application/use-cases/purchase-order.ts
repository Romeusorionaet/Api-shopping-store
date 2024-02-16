import { Either, left, right } from "src/core/either";
import { OrderRepository } from "../repositories/order-repository";
import { Order } from "../../enterprise/entities/order";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { BuyerAddress } from "../../enterprise/entities/buyer-address";
import { OrderWithEmptyAddressError } from "src/core/errors/order-with-empty-address-error";

interface PurchaseOrderUseCaseRequest {
  productId: string;
  buyerId: string;
  buyerAddress: BuyerAddress;
  quantity: number;
}

type PurchaseOrderUseCaseResponse = Either<
  OrderWithEmptyAddressError,
  {
    order: Order;
  }
>;

export class PurchaseOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    productId,
    buyerId,
    buyerAddress,
    quantity,
  }: PurchaseOrderUseCaseRequest): Promise<PurchaseOrderUseCaseResponse> {
    const order = Order.create({
      buyerId: new UniqueEntityID(buyerId),
      productId: new UniqueEntityID(productId),
      buyerAddress,
      quantity,
    });

    if (!order.buyerAddress) {
      return left(new OrderWithEmptyAddressError());
    }

    await this.orderRepository.create(order);

    return right({ order });
  }
}
