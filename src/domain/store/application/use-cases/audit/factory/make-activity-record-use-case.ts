import { PrismaActivityRecordRepository } from "src/infra/database/prisma/repositories/prisma-activity-record-repository";
import { CreateActivityRecordUseCase } from "../create-activity-record";
import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeCreateActivityRecordUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const activityRecordRepository = new PrismaActivityRecordRepository(
    cacheRepository,
  );
  const useCase = new CreateActivityRecordUseCase(activityRecordRepository);

  return useCase;
}
