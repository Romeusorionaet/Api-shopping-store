import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { Either, right } from "src/core/either";
import { Encrypter } from "../../../cryptography/encrypter";
import { RefreshTokensRepository } from "../../../repositories/refresh-token-repository";

interface AuthenticateUserWithGoogleUseCaseRequest {
  userId: string;
}

type AuthenticateUserWithGoogleUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

export class AuthenticateUserWithGoogleUseCase {
  constructor(
    private encrypter: Encrypter,
    private refreshTokensRepository: RefreshTokensRepository,
  ) {}

  async execute({
    userId,
  }: AuthenticateUserWithGoogleUseCaseRequest): Promise<AuthenticateUserWithGoogleUseCaseResponse> {
    // tenho um caso de uso com o mesmo funcionamento, criar um só
    const accessToken = await this.encrypter.encryptAccessToken({
      sub: userId,
    });

    const refreshToken = await this.encrypter.encryptRefreshToken({
      sub: userId,
    });

    return right({
      accessToken,
      refreshToken,
    });
  }
}
