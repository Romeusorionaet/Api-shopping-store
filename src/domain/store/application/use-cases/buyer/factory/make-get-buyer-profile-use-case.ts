import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { GetBuyerProfileUseCase } from "../get-buyer-profile";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RedisService } from "src/infra/cache/redis/redis-service";

export function makeGetBuyerProfileUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const userRepository = new PrismaUserRepository(cacheRepository);

  const useCase = new GetBuyerProfileUseCase(userRepository);

  return useCase;
}
