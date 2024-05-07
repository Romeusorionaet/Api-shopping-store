import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { CreateUserAddressUseCase } from "../create-user-address";
import { PrismaUserAddressRepository } from "src/infra/database/prisma/repositories/prisma-user-address-repository";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RedisService } from "src/infra/cache/redis/redis-service";

export function makeCreateUserAddressUseCase() {
  const userAddressRepository = new PrismaUserAddressRepository();
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const usersRepository = new PrismaUserRepository(cacheRepository);

  const useCase = new CreateUserAddressUseCase(
    userAddressRepository,
    usersRepository,
  );

  return useCase;
}
