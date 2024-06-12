import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { PurchaseOrderUseCase } from "../purchase-order";
import { PrismaUserAddressRepository } from "src/infra/database/prisma/repositories/prisma-user-address-repository";
import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { PrismaProductRatingRepository } from "src/infra/database/prisma/repositories/prisma-product-rating-repository";
import { RedisService } from "src/infra/service/setup-cache/redis-service";

export function makePurchaseOrderUseCase() {
  const redis = new RedisService();
  const cacheRepository = new RedisCacheRepository(redis);
  const productRepository = new PrismaProductRepository(cacheRepository);
  const productRatingRepository = new PrismaProductRatingRepository(
    cacheRepository,
  );
  const orderRepository = new PrismaOrderRepository(
    productRepository,
    productRatingRepository,
  );
  const userAddressRepository = new PrismaUserAddressRepository(
    cacheRepository,
  );
  const usersRepository = new PrismaUserRepository();

  const useCase = new PurchaseOrderUseCase(
    orderRepository,
    userAddressRepository,
    usersRepository,
    productRepository,
  );

  return useCase;
}
