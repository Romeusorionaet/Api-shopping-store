import { AuthenticateUserWithGoogleUseCase } from "../auth/authenticate-user-with-google";
import { PrismaRefreshTokenRepository } from "src/infra/database/prisma/repositories/prisma-refresh-token-repository";
import { JwtEncrypter } from "src/infra/cryptography/jwt-encrypter";

export function makeAuthenticateUserWithGoogleUseCase() {
  const jwtEncrypter = new JwtEncrypter();
  const refreshTokensRepository = new PrismaRefreshTokenRepository();

  const useCase = new AuthenticateUserWithGoogleUseCase(
    jwtEncrypter,
    refreshTokensRepository,
  );

  return useCase;
}
