import { PrismaNotificationsRepository } from "src/infra/database/prisma/repositories/prisma-notifications-repository";
import { FetchNotificationsUseCase } from "../fetch-notifications";
import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeFetchNotificationsUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const notificationsRepository = new PrismaNotificationsRepository(
    cacheRepository,
  );

  const useCase = new FetchNotificationsUseCase(notificationsRepository);

  return useCase;
}
