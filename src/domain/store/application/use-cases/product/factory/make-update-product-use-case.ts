import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { UpdateProductUseCase } from "../update-product";

export function makeUpdateProductUseCase() {
  const productRepository = new PrismaProductRepository();

  const useCase = new UpdateProductUseCase(productRepository);

  return useCase;
}
