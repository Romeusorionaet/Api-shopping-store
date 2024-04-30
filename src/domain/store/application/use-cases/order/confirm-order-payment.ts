import { Either, left, right } from "src/core/either";
import { OrderRepository } from "../../repositories/order-repository";

import { OrderNotFoundError } from "../errors/order-not-found-error";

interface ConfirmOrderPaymentUseCaseRequest {
  orderId: string;
}

type ConfirmOrderPaymentUseCaseResponse = Either<OrderNotFoundError, object>;

export class ConfirmOrderPaymentUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
  }: ConfirmOrderPaymentUseCaseRequest): Promise<ConfirmOrderPaymentUseCaseResponse> {
    const existOrder = this.orderRepository.findById(orderId);

    if (!existOrder) {
      return left(new OrderNotFoundError());
    }

    await this.orderRepository.confirmPayment(orderId);

    return right({});
  }
}
