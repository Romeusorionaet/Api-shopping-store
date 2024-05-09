import { PrismaRefreshTokenRepository } from "src/infra/database/prisma/repositories/prisma-refresh-token-repository";
import { RemoveRefreshTokenUseCase } from "../auth/remove-refresh-token";
import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RedisService } from "src/infra/cache/redis/redis-service";

export function makeRemoveRefreshTokenUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const refreshTokenRepository = new PrismaRefreshTokenRepository(
    cacheRepository,
  );
  const userRepository = new PrismaUserRepository(cacheRepository);

  const useCase = new RemoveRefreshTokenUseCase(
    refreshTokenRepository,
    userRepository,
  );

  return useCase;
}
