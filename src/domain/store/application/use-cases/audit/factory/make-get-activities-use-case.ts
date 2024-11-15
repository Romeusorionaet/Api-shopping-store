import { PrismaActivityRecordRepository } from "src/infra/database/prisma/repositories/prisma-activity-record-repository";
import { GetActivitiesRecordUseCase } from "../get-activities-record";
import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeGetActivityRecordUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const activityRecordRepository = new PrismaActivityRecordRepository(
    cacheRepository,
  );
  const useCase = new GetActivitiesRecordUseCase(activityRecordRepository);

  return useCase;
}
