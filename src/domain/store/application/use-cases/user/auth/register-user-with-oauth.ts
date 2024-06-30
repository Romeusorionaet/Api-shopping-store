import { User } from "src/domain/store/enterprise/entities/user";
import { UsersRepository } from "../../../repositories/users-repository";
import { hash } from "bcryptjs";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

interface RegisterUserWithOAuthUseCaseRequest {
  email: string;
  username: string;
  picture: string;
  emailVerified: boolean;
}

type RegisterUserWithOAuthUseCaseResponse = {
  user: User;
};

export class RegisterUserWithOAuthUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    username,
    picture,
    emailVerified,
  }: RegisterUserWithOAuthUseCaseRequest): Promise<RegisterUserWithOAuthUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      const user = User.create({
        email,
        username,
        password: await hash("123456", 8), // TODO senha temporária
        picture,
        emailVerified,
        publicId: new UniqueEntityID(),
        validationId: null,
      });

      await this.usersRepository.create(user);

      return { user };
    }

    if (!user.emailVerified) {
      const userUpdated = user.update({
        emailVerified: true,
        validationId: null,
      });

      await this.usersRepository.update(userUpdated);
    }

    return { user };
  }
}
