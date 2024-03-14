import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { GetBuyerProfileUseCase } from "../buyer/get-buyer-profile";

export function makeGetBuyerProfileUseCase() {
  const userRepository = new PrismaUserRepository();

  const useCase = new GetBuyerProfileUseCase(userRepository);

  return useCase;
}
