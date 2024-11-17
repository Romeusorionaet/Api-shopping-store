import { PrismaCategoryRepository } from "src/infra/database/prisma/repositories/prisma-category-repository";
import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RetrieveCategorySummariesUseCase } from "../retrieve-category-summaries";

export function makeRetrieveCategorySummariesUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const categoryRepository = new PrismaCategoryRepository(cacheRepository);
  const useCase = new RetrieveCategorySummariesUseCase(categoryRepository);

  return useCase;
}
