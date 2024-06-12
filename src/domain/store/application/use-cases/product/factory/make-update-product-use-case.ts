import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { UpdateProductUseCase } from "../update-product";
import { PrismaTechnicalProductDetailsRepository } from "src/infra/database/prisma/repositories/prisma-technical-product-details-repository";
import { RedisService } from "src/infra/cache/redis/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeUpdateProductUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const productRepository = new PrismaProductRepository(cacheRepository);
  const technicalProductDetailsRepository =
    new PrismaTechnicalProductDetailsRepository(cacheRepository);

  const useCase = new UpdateProductUseCase(
    productRepository,
    technicalProductDetailsRepository,
  );

  return useCase;
}
