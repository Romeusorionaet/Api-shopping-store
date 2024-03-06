import { UsersRepository } from "../repositories/users-repository";
import { User } from "../../enterprise/entities/user";
import { hash } from "bcryptjs";
import { Either, left, right } from "src/core/either";
import { EmailAlreadyExistsError } from "./errors/email-already-exists-error";

interface RegisterUseCaseRequest {
  username: string;
  email: string;
  password: string;
}

type RegisterUseCaseResponse = Either<
  EmailAlreadyExistsError,
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
    const passwordHash = await hash(password, 8);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new EmailAlreadyExistsError(userWithSameEmail.email));
    }

    const user = User.create({ username, email, password: passwordHash });

    await this.usersRepository.create(user);

    return right({ user });
  }
}
