import { PrismaCategoryRepository } from "src/infra/database/prisma/repositories/prisma-category-repository";
import { GetCategoryDetailsUseCase } from "../get-category-details";
import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeGetCategoryDetailsUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const categoryRepository = new PrismaCategoryRepository(cacheRepository);
  const useCase = new GetCategoryDetailsUseCase(categoryRepository);

  return useCase;
}
