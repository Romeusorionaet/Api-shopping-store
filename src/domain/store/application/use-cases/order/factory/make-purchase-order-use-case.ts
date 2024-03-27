import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { PurchaseOrderUseCase } from "../purchase-order";
import { PrismaUserAddressRepository } from "src/infra/database/prisma/repositories/prisma-user-address-repository";

export function makePurchaseOrderUseCase() {
  const orderRepository = new PrismaOrderRepository();
  const userAddressRepository = new PrismaUserAddressRepository();
  const usersRepository = new PrismaUserRepository();

  const useCase = new PurchaseOrderUseCase(
    orderRepository,
    userAddressRepository,
    usersRepository,
  );

  return useCase;
}
