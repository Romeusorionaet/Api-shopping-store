import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { CreateProductUseCase } from "../create-product";
import { PrismaCategoryRepository } from "src/infra/database/prisma/repositories/prisma-category-repository";
import { PrismaTechnicalProductDetailsRepository } from "src/infra/database/prisma/repositories/prisma-technical-product-details-repository";

export function makeCreateProductUseCase() {
  const productRepository = new PrismaProductRepository();
  const categoryRepository = new PrismaCategoryRepository();
  const technicalProductDetailsRepository =
    new PrismaTechnicalProductDetailsRepository();

  const useCase = new CreateProductUseCase(
    productRepository,
    categoryRepository,
    technicalProductDetailsRepository,
  );

  return useCase;
}
