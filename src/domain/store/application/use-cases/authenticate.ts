import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { User } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";
import { Either, left, right } from "src/core/either";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    user: User;
  }
>;

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new InvalidCredentialsError());
    }

    const doesPasswordMatches = await compare(password, user.password);

    if (!doesPasswordMatches) {
      return left(new InvalidCredentialsError());
    }

    return right({
      user,
    });
  }
}
