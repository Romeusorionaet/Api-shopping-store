import { Either, right } from "src/core/either";
import { InvalidTokenError } from "../../errors/invalid-token-error";
import { Encrypter } from "../../../cryptography/encrypter";

interface RefreshTokenUseCaseRequest {
  userId: string;
  publicId: string;
}

type RefreshTokenUseCaseResponse = Either<
  InvalidTokenError,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

export class RefreshTokenUseCase {
  constructor(private encrypter: Encrypter) {}

  async execute({
    userId,
    publicId,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    const accessToken = await this.encrypter.encryptAccessToken({
      sub: userId,
      publicId,
    });

    const refreshToken = await this.encrypter.encryptRefreshToken({
      sub: userId,
      publicId,
    });

    return right({ accessToken, refreshToken });
  }
}
