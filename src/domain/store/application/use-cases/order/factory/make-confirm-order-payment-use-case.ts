import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { ConfirmOrderPaymentUseCase } from "../confirm-order-payment";
import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";

export function makeConfirmOderPaymentUseCase() {
  const productRepository = new PrismaProductRepository();
  const orderRepository = new PrismaOrderRepository(productRepository);

  const useCase = new ConfirmOrderPaymentUseCase(orderRepository);

  return useCase;
}
