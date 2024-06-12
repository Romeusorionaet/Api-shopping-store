import { PrismaBuyerAddressRepository } from "src/infra/database/prisma/repositories/prisma-buyer-address-repository";
import { GetBuyerAddressUseCase } from "../get-buyer-address";
import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";

export function makeGetBuyerAddressUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const buyerAddressRepository = new PrismaBuyerAddressRepository(
    cacheRepository,
  );

  const useCase = new GetBuyerAddressUseCase(buyerAddressRepository);

  return useCase;
}
