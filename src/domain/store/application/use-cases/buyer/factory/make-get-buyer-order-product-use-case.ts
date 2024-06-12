import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { GetBuyerOrderProductUseCase } from "../get-buyer-order-product";
import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { PrismaProductRatingRepository } from "src/infra/database/prisma/repositories/prisma-product-rating-repository";
import { RedisService } from "src/infra/cache/redis/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeGetBuyerOrderProductUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const productRepository = new PrismaProductRepository(cacheRepository);
  const productRatingRepository = new PrismaProductRatingRepository(
    cacheRepository,
  );
  const orderRepository = new PrismaOrderRepository(
    productRepository,
    productRatingRepository,
  );

  const useCase = new GetBuyerOrderProductUseCase(orderRepository);

  return useCase;
}
