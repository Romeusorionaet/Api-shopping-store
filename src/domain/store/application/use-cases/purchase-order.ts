import { Either, right } from "src/core/either";
import { OrderRepository } from "../repositories/order-repository";
import { Order } from "../../enterprise/entities/order";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { BuyerAddress } from "../../enterprise/entities/buyer-address";

interface PurchaseOrderUseCaseRequest {
  productId: string;
  buyerId: string;
  buyerAddress: BuyerAddress;
  quantity: number;
}

type PurchaseOrderUseCaseResponse = Either<
  null,
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

    await this.orderRepository.create(order);

    return right({ order });
  }
}
