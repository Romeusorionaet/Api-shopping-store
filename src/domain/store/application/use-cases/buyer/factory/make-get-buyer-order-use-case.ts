import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { GetBuyerOrdersUseCase } from "../get-buyer-orders";

export function makeGetBuyerOrdersUseCase() {
  const orderRepository = new PrismaOrderRepository();

  const useCase = new GetBuyerOrdersUseCase(orderRepository);

  return useCase;
}
