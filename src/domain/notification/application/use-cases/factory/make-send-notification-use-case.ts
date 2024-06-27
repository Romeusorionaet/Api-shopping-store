import { PrismaNotificationsRepository } from "src/infra/database/prisma/repositories/prisma-notifications-repository";
import { SendNotificationUseCase } from "../send-notification";
import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeSendNotificationUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const notificationsRepository = new PrismaNotificationsRepository(
    cacheRepository,
  );

  const useCase = new SendNotificationUseCase(notificationsRepository);

  return useCase;
}
