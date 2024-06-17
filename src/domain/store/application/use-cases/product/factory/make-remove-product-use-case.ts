import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RemoveProductUseCase } from "../remove-product";
import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";

export function makeRemoveProductUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const productRepository = new PrismaProductRepository(cacheRepository);
  const useCase = new RemoveProductUseCase(productRepository);

  return useCase;
}
