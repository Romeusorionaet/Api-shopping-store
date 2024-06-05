import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { GetBuyerOrdersUseCase } from "../get-buyer-orders";
import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { PrismaProductRatingRepository } from "src/infra/database/prisma/repositories/prisma-product-rating-repository";

export function makeGetBuyerOrdersUseCase() {
  const productRepository = new PrismaProductRepository();
  const productRatingRepository = new PrismaProductRatingRepository();
  const orderRepository = new PrismaOrderRepository(
    productRepository,
    productRatingRepository,
  );

  const useCase = new GetBuyerOrdersUseCase(orderRepository);

  return useCase;
}
