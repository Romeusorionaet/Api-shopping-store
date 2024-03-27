import { PrismaUserAddressRepository } from "src/infra/database/prisma/repositories/prisma-user-address-repository";
import { GetUserAddressUseCase } from "../get-user-address";

export function makeGetUserAddressUseCase() {
  const userAddressRepository = new PrismaUserAddressRepository();

  const useCase = new GetUserAddressUseCase(userAddressRepository);

  return useCase;
}
