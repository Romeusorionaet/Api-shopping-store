import { Either, left, right } from "src/core/either";
import { Encrypter } from "../../cryptography/encrypter";
import dayjs from "dayjs";
import { RefreshTokensRepository } from "../../repositories/refresh-token-repository";
import { InvalidTokenError } from "../errors/invalid-token-error";
import { RefreshToken } from "src/domain/store/enterprise/entities/refresh-token";

interface RefreshTokenUseCaseRequest {
  refreshId: string;
}

type RefreshTokenUseCaseResponse = Either<
  InvalidTokenError,
  {
    accessToken: string;
    newRefreshToken: RefreshToken | null;
  }
>;

export class RefreshTokenUseCase {
  constructor(
    private refreshTokensRepository: RefreshTokensRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    refreshId,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    const refreshToken =
      await this.refreshTokensRepository.refreshToken(refreshId);

    if (!refreshToken) {
      return left(new InvalidTokenError());
    }

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(refreshToken.expires),
    );

    const accessToken = await this.encrypter.encrypt({
      sub: refreshToken.userId.toString(),
    });

    if (refreshTokenExpired) {
      await this.refreshTokensRepository.deleteMany(
        refreshToken.userId.toString(),
      );

      const newRefreshToken = await this.refreshTokensRepository.create(
        refreshToken.userId.toString(),
      );

      return right({ accessToken, newRefreshToken });
    }

    return right({ accessToken, newRefreshToken: null });
  }
}
