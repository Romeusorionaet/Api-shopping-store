import { Either, left, right } from "src/core/either";
import { UserAddress } from "src/domain/store/enterprise/entities/user-address";
import { UserAddressRepository } from "../../repositories/user-address-repository";
import { AddressNotFoundError } from "../errors/address-not-found-error";

interface GetUserAddressUseCaseRequest {
  userId: string;
}

type GetUserAddressUseCaseResponse = Either<
  AddressNotFoundError,
  {
    userAddress: UserAddress;
  }
>;

export class GetUserAddressUseCase {
  constructor(private userAddressRepository: UserAddressRepository) {}

  async execute({
    userId,
  }: GetUserAddressUseCaseRequest): Promise<GetUserAddressUseCaseResponse> {
    const userAddress = await this.userAddressRepository.findByUserId(userId);

    if (!userAddress) {
      return left(new AddressNotFoundError());
    }

    return right({ userAddress });
  }
}
