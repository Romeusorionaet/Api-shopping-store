import { JwtEncrypter } from "src/infra/cryptography/jwt-encrypter";
import { RefreshTokenUseCase } from "../auth/refresh-token";

export function makeAuthenticateUserWithGoogleUseCase() {
  const jwtEncrypter = new JwtEncrypter();

  const useCase = new RefreshTokenUseCase(jwtEncrypter);

  return useCase;
}
