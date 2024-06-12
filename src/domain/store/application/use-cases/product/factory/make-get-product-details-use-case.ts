import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { GetProductDetailsUseCase } from "../get-product-details";
import { PrismaTechnicalProductDetailsRepository } from "src/infra/database/prisma/repositories/prisma-technical-product-details-repository";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RedisService } from "src/infra/service/setup-cache/redis-service";

export function makeGetProductDetailsUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const productRepository = new PrismaProductRepository(cacheRepository);
  const technicalProductDetailsRepository =
    new PrismaTechnicalProductDetailsRepository(cacheRepository);

  const useCase = new GetProductDetailsUseCase(
    productRepository,
    technicalProductDetailsRepository,
  );

  return useCase;
}
