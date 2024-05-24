import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { GetBuyerOrderProductUseCase } from "../get-buyer-order-product";

export function makeGetBuyerOrderProductUseCase() {
  const productRepository = new PrismaProductRepository();

  const useCase = new GetBuyerOrderProductUseCase(productRepository);

  return useCase;
}
