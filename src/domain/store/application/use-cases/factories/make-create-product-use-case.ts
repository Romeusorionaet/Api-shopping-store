import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { CreateProductUseCase } from "../product/create-product";
import { PrismaCategoryRepository } from "src/infra/database/prisma/repositories/prisma-category-repository";

export function makeCreateProductUseCase() {
  const productRepository = new PrismaProductRepository();
  const categoryRepository = new PrismaCategoryRepository();

  const useCase = new CreateProductUseCase(
    productRepository,
    categoryRepository,
  );

  return useCase;
}
