import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { ConfirmOrderPaymentUseCase } from "../confirm-order-payment";
import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { PrismaProductRatingRepository } from "src/infra/database/prisma/repositories/prisma-product-rating-repository";

export function makeConfirmOderPaymentUseCase() {
  const productRepository = new PrismaProductRepository();
  const productRatingRepository = new PrismaProductRatingRepository();
  const orderRepository = new PrismaOrderRepository(
    productRepository,
    productRatingRepository,
  );

  const useCase = new ConfirmOrderPaymentUseCase(orderRepository);

  return useCase;
}
