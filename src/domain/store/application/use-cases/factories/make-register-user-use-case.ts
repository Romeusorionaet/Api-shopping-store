import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { RegisterUserUseCase } from "../register-user";
import { Bcrypt } from "src/infra/cryptography/jwt-encrypter";

export function makeRegisterUserUseCase() {
  const userRepository = new PrismaUserRepository();
  const bcrypt = new Bcrypt();

  const useCase = new RegisterUserUseCase(userRepository, bcrypt);

  return useCase;
}
