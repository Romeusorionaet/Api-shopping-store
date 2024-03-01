import { Either, left, right } from "src/core/either";
import { BuyerAddress } from "../../enterprise/entities/buyer-address";
import { BuyerAddressRepository } from "../repositories/buyer-address-repository";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

interface UpdatedBuyerAddressUseCaseRequest {
  buyerId: string;
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

type UpdatedBuyerAddressUseCaseResponse = Either<
  UserNotFoundError,
  {
    newBuyerAddress: BuyerAddress;
  }
>;

export class UpdatedBuyerAddressUseCase {
  constructor(private buyerAddressRepository: BuyerAddressRepository) {}

  async execute({
    buyerId,
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
  }: UpdatedBuyerAddressUseCaseRequest): Promise<UpdatedBuyerAddressUseCaseResponse> {
    const buyerAddress = await this.buyerAddressRepository.findById(buyerId);

    if (!buyerAddress) {
      return left(new UserNotFoundError());
    }

    const newBuyerAddress = BuyerAddress.create({
      buyerId: new UniqueEntityID(buyerAddress.id.toString()),
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

    await this.buyerAddressRepository.update(newBuyerAddress);
    // Todo

    return right({ newBuyerAddress });
  }
}
