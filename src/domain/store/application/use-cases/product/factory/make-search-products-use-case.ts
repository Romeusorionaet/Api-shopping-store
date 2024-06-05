import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { SearchProductsUseCase } from "../search-products";
import { PrismaProductRatingRepository } from "src/infra/database/prisma/repositories/prisma-product-rating-repository";

export function makeSearchProductsUseCase() {
  const productRepository = new PrismaProductRepository();
  const productRatingRepository = new PrismaProductRatingRepository();

  const useCase = new SearchProductsUseCase(
    productRepository,
    productRatingRepository,
  );

  return useCase;
}
