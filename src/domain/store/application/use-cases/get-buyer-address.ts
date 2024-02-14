import { Either, left, right } from "src/core/either";
import { BuyerAddress } from "../../enterprise/entities/buyer-address";
import { BuyerAddressRepository } from "../repositories/buyer-address-repository";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";

interface GetBuyerAddressUseCaseRequest {
  buyerId: string;
}

type GetBuyerAddressUseCaseResponse = Either<
  UserNotFoundError,
  {
    buyerAddress: BuyerAddress;
  }
>;

export class GetBuyerAddressUseCase {
  constructor(private buyerAddressRepository: BuyerAddressRepository) {}

  async execute({
    buyerId,
  }: GetBuyerAddressUseCaseRequest): Promise<GetBuyerAddressUseCaseResponse> {
    const buyerAddress = await this.buyerAddressRepository.findById(buyerId);

    if (!buyerAddress) {
      return left(new UserNotFoundError());
    }

    return right({ buyerAddress });
  }
}
