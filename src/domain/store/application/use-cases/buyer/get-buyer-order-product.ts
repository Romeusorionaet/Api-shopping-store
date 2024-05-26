import { Either, right } from "src/core/either";
import { OrderRepository } from "../../repositories/order-repository";
import { OrderProduct } from "src/domain/store/enterprise/entities/order-product";

interface GetBuyerOrderProductUseCaseRequest {
  buyerId: string;
}

type GetBuyerOrderProductUseCaseResponse = Either<
  null,
  {
    orderProducts: OrderProduct[];
  }
>;

export class GetBuyerOrderProductUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    buyerId,
  }: GetBuyerOrderProductUseCaseRequest): Promise<GetBuyerOrderProductUseCaseResponse> {
    const orders = await this.orderRepository.findByBuyerId(buyerId);

    const orderProducts = orders.flatMap((order) => order.orderProducts);

    return right({ orderProducts });
  }
}
