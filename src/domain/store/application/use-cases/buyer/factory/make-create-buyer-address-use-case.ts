import { PrismaBuyerAddressRepository } from "src/infra/database/prisma/repositories/prisma-buyer-address-repository";
import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { CreateBuyerAddressUseCase } from "../create-buyer-address";

export function makeCreateBuyerAddressUseCase() {
  const buyerAddressRepository = new PrismaBuyerAddressRepository();
  const userRepository = new PrismaUserRepository();

  const useCase = new CreateBuyerAddressUseCase(
    buyerAddressRepository,
    userRepository,
  );

  return useCase;
}
