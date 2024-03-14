import { PrismaBuyerAddressRepository } from "src/infra/database/prisma/repositories/prisma-buyer-address-repository";
import { RegisterBuyerAddressUseCase } from "../buyer/register-buyer-address";
import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";

export function makeCreateBuyerAddressUseCase() {
  const buyerAddressRepository = new PrismaBuyerAddressRepository();
  const userRepository = new PrismaUserRepository();

  const useCase = new RegisterBuyerAddressUseCase(
    buyerAddressRepository,
    userRepository,
  );

  return useCase;
}
