import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { BcryptHash } from "src/infra/cryptography/bcrypt-hash";
import { RegisterUserUseCase } from "../auth/register-user";
import { RedisService } from "src/infra/cache/redis/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeRegisterUserUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const userRepository = new PrismaUserRepository(cacheRepository);
  const bcrypt = new BcryptHash();

  const useCase = new RegisterUserUseCase(userRepository, bcrypt);

  return useCase;
}
