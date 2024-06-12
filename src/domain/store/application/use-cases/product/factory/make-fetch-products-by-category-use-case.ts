import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { FetchProductsByCategoryUseCase } from "../fetch-products-by-category";
import { RedisService } from "src/infra/cache/redis/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeFetchProductsByCategoryUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const productRepository = new PrismaProductRepository(cacheRepository);
  const useCase = new FetchProductsByCategoryUseCase(productRepository);

  return useCase;
}
