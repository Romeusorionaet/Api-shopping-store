import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { SearchProductsUseCase } from "../search-products";

export function makeSearchProductsUseCase() {
  const productRepository = new PrismaProductRepository();
  const useCase = new SearchProductsUseCase(productRepository);

  return useCase;
}
