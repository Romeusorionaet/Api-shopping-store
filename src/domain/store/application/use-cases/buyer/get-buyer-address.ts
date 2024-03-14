import { Either, left, right } from "src/core/either";
import { BuyerAddress } from "src/domain/store/enterprise/entities/buyer-address";
import { BuyerAddressRepository } from "../../repositories/buyer-address-repository";
import { AddressNotFoundError } from "../errors/address-not-found-error";

interface GetBuyerAddressUseCaseRequest {
  addressId: string;
}

type GetBuyerAddressUseCaseResponse = Either<
  AddressNotFoundError,
  {
    buyerAddress: BuyerAddress;
  }
>;

export class GetBuyerAddressUseCase {
  constructor(private buyerAddressRepository: BuyerAddressRepository) {}

  async execute({
    addressId,
  }: GetBuyerAddressUseCaseRequest): Promise<GetBuyerAddressUseCaseResponse> {
    const buyerAddress = await this.buyerAddressRepository.findById(addressId);

    if (!buyerAddress) {
      return left(new AddressNotFoundError());
    }

    return right({ buyerAddress });
  }
}
