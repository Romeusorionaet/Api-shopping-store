import { Either, left, right } from "src/core/either";
import { UsersRepository } from "../../../repositories/users-repository";
import { HashGenerator } from "../../../cryptography/hash-generator";
import { UserAlreadyExistsError } from "../../errors/user-already-exists-error";
import { User } from "src/domain/store/enterprise/entities/user";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

interface RegisterUserUseCaseRequest {
  username: string;
  email: string;
  password: string;
  picture: string;
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
    picture,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      username,
      email,
      password: hashedPassword,
      picture,
      emailVerified: false,
      validationId: new UniqueEntityID(),
    });

    await this.usersRepository.create(user);

    return right({ user });
  }
}
