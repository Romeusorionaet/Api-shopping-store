import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { FetchProductsUseCase } from "../fetch-products";
import { RedisService } from "src/infra/cache/redis/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeFetchProductsUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const productRepository = new PrismaProductRepository(cacheRepository);
  const useCase = new FetchProductsUseCase(productRepository);

  return useCase;
}
