import { PrismaOrderRepository } from "src/infra/database/prisma/repositories/prisma-order-repository";
import { PurchaseOrderUseCase } from "../order/purchase-order";
import { PrismaBuyerAddressRepository } from "src/infra/database/prisma/repositories/prisma-buyer-address-repository";

export function makeCreateOrderUseCase() {
  const orderRepository = new PrismaOrderRepository();
  const buyerAddress = new PrismaBuyerAddressRepository();

  const useCase = new PurchaseOrderUseCase(orderRepository, buyerAddress);

  return useCase;
}
