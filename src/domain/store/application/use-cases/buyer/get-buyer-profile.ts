import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { Either, left, right } from "src/core/either";
import { User } from "src/domain/store/enterprise/entities/user";
import { UsersRepository } from "../../repositories/users-repository";

interface GetUserProfileUseCaseRequest {
  buyerId: string;
}

type GetUserProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    buyer: User;
  }
>;

export class GetBuyerProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    buyerId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const buyer = await this.usersRepository.findById(buyerId);

    if (!buyer) {
      return left(new ResourceNotFoundError());
    }

    return right({
      buyer,
    });
  }
}
