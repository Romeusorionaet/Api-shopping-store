import { Either, left, right } from "src/core/either";
import { BuyerAddress } from "../../../enterprise/entities/buyer-address";
import { BuyerAddressRepository } from "../../repositories/buyer-address-repository";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { AddressNotFoundError } from "../errors/address-not-found-error";

interface UpdateBuyerAddressUseCaseRequest {
  addressId: string;
  cep: number;
  city: string;
  uf: string;
  street: string;
  neighborhood: string;
  houseNumber: number;
  complement: string;
  phoneNumber: number;
  username: string;
  email: string;
}

type UpdateBuyerAddressUseCaseResponse = Either<
  UserNotFoundError,
  {
    buyerAddressUpdated: BuyerAddress;
  }
>;

export class UpdateBuyerAddressUseCase {
  constructor(private buyerAddressRepository: BuyerAddressRepository) {}

  async execute({
    addressId,
    cep,
    city,
    uf,
    street,
    neighborhood,
    houseNumber,
    complement,
    phoneNumber,
    username,
    email,
  }: UpdateBuyerAddressUseCaseRequest): Promise<UpdateBuyerAddressUseCaseResponse> {
    const buyerAddress = await this.buyerAddressRepository.findById(addressId);

    if (!buyerAddress) {
      return left(new AddressNotFoundError());
    }

    const buyerAddressUpdated = buyerAddress.update({
      cep,
      city,
      uf,
      street,
      neighborhood,
      houseNumber,
      complement,
      phoneNumber,
      username,
      email,
    });

    await this.buyerAddressRepository.update(buyerAddressUpdated);

    return right({ buyerAddressUpdated });
  }
}
