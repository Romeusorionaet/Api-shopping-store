import { JwtEncrypter } from "src/infra/cryptography/jwt-encrypter";
import { RefreshTokenUseCase } from "../refresh-token";
import { PrismaRefreshTokenRepository } from "src/infra/database/prisma/repositories/prisma-refresh-token-repository";

export function makeRefreshTokenUseCase() {
  const refreshTokenRepository = new PrismaRefreshTokenRepository();
  const jwtEncrypter = new JwtEncrypter();

  const useCase = new RefreshTokenUseCase(refreshTokenRepository, jwtEncrypter);

  return useCase;
}
