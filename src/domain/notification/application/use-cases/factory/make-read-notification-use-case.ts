import { PrismaNotificationsRepository } from "src/infra/database/prisma/repositories/prisma-notifications-repository";
import { ReadNotificationUseCase } from "../read-notification";
import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeReadNotificationUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const notificationsRepository = new PrismaNotificationsRepository(
    cacheRepository,
  );

  const useCase = new ReadNotificationUseCase(notificationsRepository);

  return useCase;
}
