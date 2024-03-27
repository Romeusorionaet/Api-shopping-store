import { Either, right } from "src/core/either";
import { OrderRepository } from "../../repositories/order-repository";
import { Order } from "../../../enterprise/entities/order";

interface GetBuyerOrderUseCaseRequest {
  buyerId: string;
}

type GetBuyerOrderUseCaseResponse = Either<
  null,
  {
    orders: Order[];
  }
>;

export class GetBuyerOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    buyerId,
  }: GetBuyerOrderUseCaseRequest): Promise<GetBuyerOrderUseCaseResponse> {
    const orders = await this.orderRepository.findByBuyerId(buyerId);

    return right({ orders });
  }
}
