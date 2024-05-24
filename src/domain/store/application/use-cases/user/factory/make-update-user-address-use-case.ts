import { UpdateUserAddressUseCase } from "../update-user-address";
import { PrismaUserAddressRepository } from "src/infra/database/prisma/repositories/prisma-user-address-repository";

export function makeUpdateUserAddressUseCase() {
  const updateUserAddressRepository = new PrismaUserAddressRepository();

  const useCase = new UpdateUserAddressUseCase(updateUserAddressRepository);

  return useCase;
}
