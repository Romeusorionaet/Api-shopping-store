import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { FetchProductsUseCase } from "../fetch-products";

export function makeFetchProductsUseCase() {
  const productRepository = new PrismaProductRepository();
  const useCase = new FetchProductsUseCase(productRepository);

  return useCase;
}
