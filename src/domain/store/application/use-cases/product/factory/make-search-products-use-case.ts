import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { SearchProductsUseCase } from "../search-products";
import { PrismaProductRatingRepository } from "src/infra/database/prisma/repositories/prisma-product-rating-repository";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RedisService } from "src/infra/service/setup-cache/redis-service";

export function makeSearchProductsUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const productRepository = new PrismaProductRepository(cacheRepository);
  const productRatingRepository = new PrismaProductRatingRepository(
    cacheRepository,
  );

  const useCase = new SearchProductsUseCase(
    productRepository,
    productRatingRepository,
  );

  return useCase;
}
