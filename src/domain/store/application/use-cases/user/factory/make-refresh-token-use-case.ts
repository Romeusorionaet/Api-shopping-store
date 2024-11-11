import { JwtEncrypter } from "src/infra/cryptography/jwt-encrypter";
import { RefreshTokenUseCase } from "../auth/refresh-token";
import { PrismaStaffRepository } from "src/infra/database/prisma/repositories/prisma-staff-respository";

export function makeRefreshTokenUseCase() {
  const jwtEncrypter = new JwtEncrypter();
  const staffRepository = new PrismaStaffRepository();

  const useCase = new RefreshTokenUseCase(jwtEncrypter, staffRepository);

  return useCase;
}
