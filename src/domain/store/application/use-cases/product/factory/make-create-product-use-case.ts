import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { CreateProductUseCase } from "../create-product";
import { PrismaCategoryRepository } from "src/infra/database/prisma/repositories/prisma-category-repository";
import { PrismaTechnicalProductDetailsRepository } from "src/infra/database/prisma/repositories/prisma-technical-product-details-repository";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RedisService } from "src/infra/service/setup-cache/redis-service";

export function makeCreateProductUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const productRepository = new PrismaProductRepository(cacheRepository);
  const categoryRepository = new PrismaCategoryRepository();
  const technicalProductDetailsRepository =
    new PrismaTechnicalProductDetailsRepository(cacheRepository);

  const useCase = new CreateProductUseCase(
    productRepository,
    categoryRepository,
    technicalProductDetailsRepository,
  );

  return useCase;
}
