import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { UpdateProductUseCase } from "../update-product";
import { PrismaTechnicalProductDetailsRepository } from "src/infra/database/prisma/repositories/prisma-technical-product-details-repository";

export function makeUpdateProductUseCase() {
  const productRepository = new PrismaProductRepository();
  const technicalProductDetailsRepository =
    new PrismaTechnicalProductDetailsRepository();

  const useCase = new UpdateProductUseCase(
    productRepository,
    technicalProductDetailsRepository,
  );

  return useCase;
}
