import { Either, right } from "src/core/either";
import { InvalidTokenError } from "../../errors/invalid-token-error";
import { Encrypter } from "../../../cryptography/encrypter";
import { RefreshTokensRepository } from "../../../repositories/refresh-token-repository";

interface RefreshTokenUseCaseRequest {
  userId: string;
}

type RefreshTokenUseCaseResponse = Either<
  InvalidTokenError,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

export class RefreshTokenUseCase {
  constructor(
    private refreshTokensRepository: RefreshTokensRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    userId,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    const accessToken = await this.encrypter.encryptAccessToken({
      sub: userId,
    });

    const refreshToken = await this.encrypter.encryptRefreshToken({
      sub: userId,
    });

    return right({ accessToken, refreshToken });
  }
}
