import { PrismaUserAddressRepository } from "src/infra/database/prisma/repositories/prisma-user-address-repository";
import { GetUserAddressUseCase } from "../get-user-address";
import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeGetUserAddressUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const userAddressRepository = new PrismaUserAddressRepository(
    cacheRepository,
  );

  const useCase = new GetUserAddressUseCase(userAddressRepository);

  return useCase;
}
