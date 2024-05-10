import { User } from "src/domain/store/enterprise/entities/user";
import { UsersRepository } from "../../../repositories/users-repository";
import { hash } from "bcryptjs";

interface RegisterUserWithGoogleUseCaseRequest {
  email: string;
  username: string;
}

type RegisterUserWithGoogleUseCaseResponse = {
  user: User;
};

export class RegisterUserWithGoogleUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    username,
  }: RegisterUserWithGoogleUseCaseRequest): Promise<RegisterUserWithGoogleUseCaseResponse> {
    console.log("==usecase==", email, username, "==usecase==");

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      const user = User.create({
        email,
        username,
        password: await hash("123456", 8), // senha temporária
      });

      await this.usersRepository.create(user);

      return { user };
    }

    return { user };
  }
}
