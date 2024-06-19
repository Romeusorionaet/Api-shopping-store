import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { ConfirmEmailUseCase } from "../auth/confirm-email";

export function makeConfirmEmailCase() {
  const userRepository = new PrismaUserRepository();

  const useCase = new ConfirmEmailUseCase(userRepository);

  return useCase;
}
