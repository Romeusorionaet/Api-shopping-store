import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { Either, left, right } from "src/core/either";
import { UsersRepository } from "../../../repositories/users-repository";
import { HashComparer } from "../../../cryptography/hash-comparer";
import { Encrypter } from "../../../cryptography/encrypter";
import { EmailNotVerifiedError } from "../../errors/email-not-verified-error";

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError | EmailNotVerifiedError,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new InvalidCredentialsError());
    }

    if (!user.emailVerified) {
      return left(new EmailNotVerifiedError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError());
    }

    const accessToken = await this.encrypter.encryptAccessToken({
      sub: user.id.toString(),
    });

    const refreshToken = await this.encrypter.encryptAccessToken({
      sub: user.id.toString(),
    });

    return right({
      accessToken,
      refreshToken,
    });
  }
}
