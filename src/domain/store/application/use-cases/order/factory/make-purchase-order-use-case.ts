import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { PurchaseOrderUseCase } from "../purchase-order";
import { PrismaUserAddressRepository } from "src/infra/database/prisma/repositories/prisma-user-address-repository";
import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RedisService } from "src/infra/cache/redis/redis-service";

export function makePurchaseOrderUseCase() {
  const productRepository = new PrismaProductRepository();
  const orderRepository = new PrismaOrderRepository(productRepository);
  const userAddressRepository = new PrismaUserAddressRepository();
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const usersRepository = new PrismaUserRepository(cacheRepository);

  const useCase = new PurchaseOrderUseCase(
    orderRepository,
    userAddressRepository,
    usersRepository,
    productRepository,
  );

  return useCase;
}
