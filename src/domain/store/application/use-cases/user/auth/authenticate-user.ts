import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { Either, left, right } from "src/core/either";
import { RefreshToken } from "src/domain/store/enterprise/entities/refresh-token";
import dayjs from "dayjs";
import { UsersRepository } from "../../../repositories/users-repository";
import { HashComparer } from "../../../cryptography/hash-comparer";
import { Encrypter } from "../../../cryptography/encrypter";
import { RefreshTokensRepository } from "../../../repositories/refresh-token-repository";

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string;
    refreshToken: RefreshToken;
  }
>;

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
    private refreshTokensRepository: RefreshTokensRepository,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new InvalidCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    });

    await this.refreshTokensRepository.deleteMany(user.id.toString());

    const expires = dayjs().add(1, "m").unix();

    const refreshToken = RefreshToken.create({
      userId: user.id,
      expires,
    });

    await this.refreshTokensRepository.create(refreshToken);

    return right({
      accessToken,
      refreshToken,
    });
  }
}
