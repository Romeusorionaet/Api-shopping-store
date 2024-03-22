import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { BcryptHash } from "src/infra/cryptography/bcrypt-hash";
import { RegisterUserUseCase } from "../register-user";

export function makeRegisterUserUseCase() {
  const userRepository = new PrismaUserRepository();
  const bcrypt = new BcryptHash();

  const useCase = new RegisterUserUseCase(userRepository, bcrypt);

  return useCase;
}
