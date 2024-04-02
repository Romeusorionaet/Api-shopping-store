import { Either, left, right } from "src/core/either";
import dayjs from "dayjs";
import { RefreshToken } from "src/domain/store/enterprise/entities/refresh-token";
import { InvalidTokenError } from "../../errors/invalid-token-error";
import { Encrypter } from "../../../cryptography/encrypter";
import { RefreshTokensRepository } from "../../../repositories/refresh-token-repository";

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

      const expires = dayjs().add(1, "m").unix();

      const newRefreshToken = RefreshToken.create({
        userId: refreshToken.userId,
        expires,
      });

      this.refreshTokensRepository.create(newRefreshToken);

      return right({ accessToken, newRefreshToken });
    }

    return right({ accessToken, newRefreshToken: null });
  }
}
