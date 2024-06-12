import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { UpdateUserAddressUseCase } from "../update-user-address";
import { PrismaUserAddressRepository } from "src/infra/database/prisma/repositories/prisma-user-address-repository";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeUpdateUserAddressUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const updateUserAddressRepository = new PrismaUserAddressRepository(
    cacheRepository,
  );

  const useCase = new UpdateUserAddressUseCase(updateUserAddressRepository);

  return useCase;
}
