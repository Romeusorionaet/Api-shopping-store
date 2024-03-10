import { UsersRepository } from "../repositories/users-repository";
import { User } from "../../enterprise/entities/user";
import { Either, left, right } from "src/core/either";
import { HashGenerator } from "../cryptography/hash-generator";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterUserUseCaseRequest {
  username: string;
  email: string;
  password: string;
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    username,
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({ username, email, password: hashedPassword });

    await this.usersRepository.create(user);

    return right({ user });
  }
}
