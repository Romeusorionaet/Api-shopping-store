import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { RegisterUserWithGoogleUseCase } from "../auth/register-user-with-google";
import { RedisService } from "src/infra/cache/redis/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeRegisterUserWithGoogleUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const userRepository = new PrismaUserRepository(cacheRepository);

  const useCase = new RegisterUserWithGoogleUseCase(userRepository);

  return useCase;
}
