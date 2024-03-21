import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { PurchaseOrderUseCase } from "../order/purchase-order";
import { PrismaBuyerAddressRepository } from "src/infra/database/prisma/repositories/prisma-buyer-address-repository";
import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";

export function makeCreateOrderUseCase() {
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
