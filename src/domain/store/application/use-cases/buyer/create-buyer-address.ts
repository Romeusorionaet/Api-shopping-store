import { UsersRepository } from "../../repositories/users-repository";
import { Either, left, right } from "src/core/either";
import { BuyerAddress } from "../../../enterprise/entities/buyer-address";
import { BuyerAddressRepository } from "../../repositories/buyer-address-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { AddressAlreadyExistError } from "../errors/address-already-exist-error";

interface CreateBuyerAddressUseCaseRequest {
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

type CreateBuyerAddressUseCaseResponse = Either<
  UserNotFoundError | AddressAlreadyExistError,
  {
    buyerAddress: BuyerAddress;
  }
>;

export class CreateBuyerAddressUseCase {
  constructor(
    private buyerAddressRepository: BuyerAddressRepository,
    private usersRepository: UsersRepository,
  ) {}

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
  }: CreateBuyerAddressUseCaseRequest): Promise<CreateBuyerAddressUseCaseResponse> {
    const buyer = await this.usersRepository.findById(buyerId);

    const verifyBuyerAddress =
      await this.buyerAddressRepository.findByBuyerId(buyerId);

    const existBuyerAddress = !!verifyBuyerAddress?.find(
      (item) => item.buyerId.toString() === buyerId && item.orderId === null,
    );

    if (existBuyerAddress) {
      return left(new AddressAlreadyExistError());
    }

    if (!buyer) {
      return left(new UserNotFoundError());
    }

    const buyerAddress = BuyerAddress.create({
      buyerId: new UniqueEntityID(buyer.id.toString()),
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

    await this.buyerAddressRepository.create(buyerAddress);

    return right({ buyerAddress });
  }
}
