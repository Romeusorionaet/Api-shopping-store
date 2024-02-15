import { Either, left, right } from "src/core/either";
import { OrderRepository } from "../repositories/order-repository";
import { Order } from "../../enterprise/entities/order";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";

interface GetBuyerOrderUseCaseRequest {
  buyerId: string;
}

type GetBuyerOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order;
  }
>;

export class GetBuyerOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    buyerId,
  }: GetBuyerOrderUseCaseRequest): Promise<GetBuyerOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(buyerId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    return right({ order });
  }
}
