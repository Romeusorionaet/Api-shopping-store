import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { GetBuyerOrderProductUseCase } from "../get-buyer-order-product";
import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";

export function makeGetBuyerOrderProductUseCase() {
  const productRepository = new PrismaProductRepository();
  const orderRepository = new PrismaOrderRepository(productRepository);

  const useCase = new GetBuyerOrderProductUseCase(orderRepository);

  return useCase;
}
