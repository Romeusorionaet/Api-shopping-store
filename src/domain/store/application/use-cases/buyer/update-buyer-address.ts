import { Either, left, right } from "src/core/either";
import { BuyerAddress } from "../../../enterprise/entities/buyer-address";
import { BuyerAddressRepository } from "../../repositories/buyer-address-repository";
import { AddressNotFoundError } from "../errors/address-not-found-error";

interface UpdateBuyerAddressUseCaseRequest {
  id: string;
  cep: number;
  city: string;
  uf: string;
  street: string;
  neighborhood: string;
  houseNumber: number;
  complement: string;
  phoneNumber: string;
  username: string;
  email: string;
}

type UpdateBuyerAddressUseCaseResponse = Either<
  AddressNotFoundError,
  {
    buyerAddressUpdated: BuyerAddress;
  }
>;

export class UpdateBuyerAddressUseCase {
  constructor(private buyerAddressRepository: BuyerAddressRepository) {}

  async execute({
    id,
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
    const buyerAddress = await this.buyerAddressRepository.findById(id);

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
