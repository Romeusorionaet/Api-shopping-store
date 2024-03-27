import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { CreateUserAddressUseCase } from "../create-user-address";
import { PrismaUserAddressRepository } from "src/infra/database/prisma/repositories/prisma-user-address-repository";

export function makeCreateUserAddressUseCase() {
  const userAddressRepository = new PrismaUserAddressRepository();
  const usersRepository = new PrismaUserRepository();

  const useCase = new CreateUserAddressUseCase(
    userAddressRepository,
    usersRepository,
  );

  return useCase;
}
