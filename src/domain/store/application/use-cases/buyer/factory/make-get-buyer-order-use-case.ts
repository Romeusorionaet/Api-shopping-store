import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { GetBuyerOrdersUseCase } from "../get-buyer-orders";
import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";

export function makeGetBuyerOrdersUseCase() {
  const productRepository = new PrismaProductRepository();
  const orderRepository = new PrismaOrderRepository(productRepository);

  const useCase = new GetBuyerOrdersUseCase(orderRepository);

  return useCase;
}
