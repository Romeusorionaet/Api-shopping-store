import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { Either, right } from "src/core/either";
import { RefreshToken } from "src/domain/store/enterprise/entities/refresh-token";
import dayjs from "dayjs";
import { Encrypter } from "../../../cryptography/encrypter";
import { RefreshTokensRepository } from "../../../repositories/refresh-token-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

interface AuthenticateUserWithGoogleUseCaseRequest {
  userId: string;
}

type AuthenticateUserWithGoogleUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string;
    refreshToken: RefreshToken;
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
    const accessToken = await this.encrypter.encrypt({
      sub: userId,
    });

    await this.refreshTokensRepository.deleteMany(userId);

    const expires = dayjs().add(25, "m").unix();

    const refreshToken = RefreshToken.create({
      userId: new UniqueEntityID(userId),
      expires,
    });

    await this.refreshTokensRepository.create(refreshToken);

    return right({
      accessToken,
      refreshToken,
    });
  }
}
