import { AuthenticateUserWithGoogleUseCase } from "../auth/authenticate-user-with-google";
import { PrismaRefreshTokenRepository } from "src/infra/database/prisma/repositories/prisma-refresh-token-repository";
import { JwtEncrypter } from "src/infra/cryptography/jwt-encrypter";
import { RedisService } from "src/infra/cache/redis/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeAuthenticateUserWithGoogleUseCase() {
  const jwtEncrypter = new JwtEncrypter();
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const refreshTokensRepository = new PrismaRefreshTokenRepository(
    cacheRepository,
  );

  const useCase = new AuthenticateUserWithGoogleUseCase(
    jwtEncrypter,
    refreshTokensRepository,
  );

  return useCase;
}
