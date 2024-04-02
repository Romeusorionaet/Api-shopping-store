import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { RegisterUserWithGoogleUseCase } from "../auth/register-user-with-google";

export function makeRegisterUserWithGoogleUseCase() {
  const userRepository = new PrismaUserRepository();

  const useCase = new RegisterUserWithGoogleUseCase(userRepository);

  return useCase;
}
