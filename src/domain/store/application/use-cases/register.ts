/* eslint-disable camelcase */
import { UserAlreadyExistsError } from "src/core/errors/user-already-exists";
import { UsersRepository } from "../repositories/users-repository";
import { User } from "../../enterprise/entities/user";
import { hash } from "bcryptjs";
import { Either, left, right } from "src/core/either";

interface RegisterUseCaseRequest {
  username: string;
  email: string;
  password: string;
}

type RegisterUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    username,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 8);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError());
    }

    const user = User.create({ username, email, password: password_hash });

    await this.usersRepository.create(user);

    return right({ user });
  }
}
