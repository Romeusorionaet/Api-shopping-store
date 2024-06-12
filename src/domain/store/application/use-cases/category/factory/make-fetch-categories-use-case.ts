import { PrismaCategoryRepository } from "src/infra/database/prisma/repositories/prisma-category-repository";
import { FetchCategoriesUseCase } from "../fetch-categories";
import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeFetchCategoriesUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const categoryRepository = new PrismaCategoryRepository(cacheRepository);
  const useCase = new FetchCategoriesUseCase(categoryRepository);

  return useCase;
}
