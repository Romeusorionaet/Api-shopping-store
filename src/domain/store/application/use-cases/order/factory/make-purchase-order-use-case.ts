import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { PurchaseOrderUseCase } from "../purchase-order";
import { PrismaUserAddressRepository } from "src/infra/database/prisma/repositories/prisma-user-address-repository";
import { PrismaProductRepository } from "src/infra/database/prisma/repositories/prisma-product-repository";

export function makePurchaseOrderUseCase() {
  const productRepository = new PrismaProductRepository();
  const orderRepository = new PrismaOrderRepository(productRepository);
  const userAddressRepository = new PrismaUserAddressRepository();
  const usersRepository = new PrismaUserRepository();

  const useCase = new PurchaseOrderUseCase(
    orderRepository,
    userAddressRepository,
    usersRepository,
    productRepository,
  );

  return useCase;
}
