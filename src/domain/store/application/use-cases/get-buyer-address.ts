import { Either, left, right } from "src/core/either";
import { BuyerAddress } from "../../enterprise/entities/buyer-address";
import { BuyerAddressRepository } from "../repositories/buyer-address-repository";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";

interface GetBuyerAddressUseCaseRequest {
  buyerId: string;
}

type GetBuyerAddressUseCaseResponse = Either<
  ResourceNotFoundError,
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
      return left(new ResourceNotFoundError());
    }

    return right({ buyerAddress });
  }
}
