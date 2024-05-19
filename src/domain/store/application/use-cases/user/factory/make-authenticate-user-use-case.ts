import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { JwtEncrypter } from "src/infra/cryptography/jwt-encrypter";
import { BcryptHash } from "src/infra/cryptography/bcrypt-hash";
import { AuthenticateUserUseCase } from "../auth/authenticate-user";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RedisService } from "src/infra/cache/redis/redis-service";

export function makeAuthenticateUserUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const userRepository = new PrismaUserRepository(cacheRepository);
  const bcrypt = new BcryptHash();
  const jwtEncrypter = new JwtEncrypter();

  const useCase = new AuthenticateUserUseCase(
    userRepository,
    bcrypt,
    jwtEncrypter,
  );

  return useCase;
}
