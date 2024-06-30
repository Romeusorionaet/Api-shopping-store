import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { RegisterUserWithOAuthUseCase } from "../auth/register-user-with-oauth";

export function makeRegisterUserWithOAuthUseCase() {
  const userRepository = new PrismaUserRepository();

  const useCase = new RegisterUserWithOAuthUseCase(userRepository);

  return useCase;
}
