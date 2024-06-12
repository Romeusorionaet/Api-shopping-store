import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { CreateUserAddressUseCase } from "../create-user-address";
import { PrismaUserAddressRepository } from "src/infra/database/prisma/repositories/prisma-user-address-repository";
import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeCreateUserAddressUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const userAddressRepository = new PrismaUserAddressRepository(
    cacheRepository,
  );
  const usersRepository = new PrismaUserRepository();

  const useCase = new CreateUserAddressUseCase(
    userAddressRepository,
    usersRepository,
  );

  return useCase;
}
