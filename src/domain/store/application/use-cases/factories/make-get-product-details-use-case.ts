import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { GetProductDetailsUseCase } from "../product/get-product-details";

export function makeGetProductDetailsUseCase() {
  const productRepository = new PrismaProductRepository();
  const useCase = new GetProductDetailsUseCase(productRepository);

  return useCase;
}
