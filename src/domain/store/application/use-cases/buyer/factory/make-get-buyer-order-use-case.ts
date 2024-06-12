import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { GetBuyerOrdersUseCase } from "../get-buyer-orders";
import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { PrismaProductRatingRepository } from "src/infra/database/prisma/repositories/prisma-product-rating-repository";
import { RedisService } from "src/infra/cache/redis/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeGetBuyerOrdersUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const productRepository = new PrismaProductRepository(cacheRepository);
  const productRatingRepository = new PrismaProductRatingRepository();
  const orderRepository = new PrismaOrderRepository(
    productRepository,
    productRatingRepository,
  );

  const useCase = new GetBuyerOrdersUseCase(orderRepository);

  return useCase;
}
