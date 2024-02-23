import { PrismaProductRepository } from "../../repositories/prisma/prisma-product-repository";
import { CreateProductUseCase } from "../create-product";

export function makeCreateProductUseCase() {
  const productRepository = new PrismaProductRepository();
  const useCase = new CreateProductUseCase(productRepository);

  return useCase;
}
