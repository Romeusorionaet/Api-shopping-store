import { JwtEncrypter } from "src/infra/cryptography/jwt-encrypter";
import { PrismaRefreshTokenRepository } from "src/infra/database/prisma/repositories/prisma-refresh-token-repository";
import { RefreshTokenUseCase } from "../auth/refresh-token";
import { RedisService } from "src/infra/cache/redis/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeRefreshTokenUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const refreshTokenRepository = new PrismaRefreshTokenRepository(
    cacheRepository,
  );
  const jwtEncrypter = new JwtEncrypter();

  const useCase = new RefreshTokenUseCase(refreshTokenRepository, jwtEncrypter);

  return useCase;
}
