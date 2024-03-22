import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { PrismaBuyerAddressRepository } from "src/infra/database/prisma/repositories/prisma-buyer-address-repository";
import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { PurchaseOrderUseCase } from "../purchase-order";

export function makePurchaseOrderUseCase() {
  const orderRepository = new PrismaOrderRepository();
  const buyerAddressRepository = new PrismaBuyerAddressRepository();
  const usersRepository = new PrismaUserRepository();

  const useCase = new PurchaseOrderUseCase(
    orderRepository,
    buyerAddressRepository,
    usersRepository,
  );

  return useCase;
}
