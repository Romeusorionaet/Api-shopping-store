import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { Either, left, right } from "src/core/either";
import { UsersRepository } from "../../../repositories/users-repository";
import { RefreshTokensRepository } from "../../../repositories/refresh-token-repository";

interface RemoveRefreshTokenUseCaseRequest {
  id: string;
}

type RemoveRefreshTokenUseCaseResponse = Either<
  InvalidCredentialsError,
  object
>;

export class RemoveRefreshTokenUseCase {
  constructor(
    private refreshTokensRepository: RefreshTokensRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    id,
  }: RemoveRefreshTokenUseCaseRequest): Promise<RemoveRefreshTokenUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return left(new InvalidCredentialsError());
    }

    await this.refreshTokensRepository.deleteMany(id);

    return right({});
  }
}
