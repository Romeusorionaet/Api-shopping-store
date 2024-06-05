import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { GetBuyerOrderProductUseCase } from "../get-buyer-order-product";
import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { PrismaProductRatingRepository } from "src/infra/database/prisma/repositories/prisma-product-rating-repository";

export function makeGetBuyerOrderProductUseCase() {
  const productRepository = new PrismaProductRepository();
  const productRatingRepository = new PrismaProductRatingRepository();
  const orderRepository = new PrismaOrderRepository(
    productRepository,
    productRatingRepository,
  );

  const useCase = new GetBuyerOrderProductUseCase(orderRepository);

  return useCase;
}
