import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { GetProductDetailsUseCase } from "../get-product-details";
import { PrismaTechnicalProductDetailsRepository } from "src/infra/database/prisma/repositories/prisma-technical-product-details-repository";

export function makeGetProductDetailsUseCase() {
  const productRepository = new PrismaProductRepository();
  const technicalProductDetailsRepository =
    new PrismaTechnicalProductDetailsRepository();

  const useCase = new GetProductDetailsUseCase(
    productRepository,
    technicalProductDetailsRepository,
  );

  return useCase;
}
