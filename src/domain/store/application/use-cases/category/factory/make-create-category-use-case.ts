import { PrismaCategoryRepository } from "src/infra/database/prisma/repositories/prisma-category-repository";
import { CreateCategoryUseCase } from "../create-category";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RedisService } from "src/infra/service/setup-cache/redis-service";

export function makeCreateCategoryUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const categoryRepository = new PrismaCategoryRepository(cacheRepository);
  const useCase = new CreateCategoryUseCase(categoryRepository);

  return useCase;
}
