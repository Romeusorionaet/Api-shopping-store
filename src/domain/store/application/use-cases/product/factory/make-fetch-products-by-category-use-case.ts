import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { FetchProductsByCategoryUseCase } from "../fetch-products-by-category";

export function makeFetchProductsByCategoryUseCase() {
  const productRepository = new PrismaProductRepository();
  const useCase = new FetchProductsByCategoryUseCase(productRepository);

  return useCase;
}
