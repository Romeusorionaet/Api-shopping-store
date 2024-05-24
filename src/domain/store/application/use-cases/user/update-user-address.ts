import { Either, left, right } from "src/core/either";
import { AddressNotFoundError } from "../errors/address-not-found-error";
import { UserAddressRepository } from "../../repositories/user-address-repository";
import { UserAddress } from "src/domain/store/enterprise/entities/user-address";

interface UpdateUserAddressUseCaseRequest {
  userId: string;
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

type UpdateUserAddressUseCaseResponse = Either<
  AddressNotFoundError,
  {
    userAddressUpdated: UserAddress;
  }
>;

export class UpdateUserAddressUseCase {
  constructor(private userAddressRepository: UserAddressRepository) {}

  async execute({
    userId,
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
  }: UpdateUserAddressUseCaseRequest): Promise<UpdateUserAddressUseCaseResponse> {
    const userAddress = await this.userAddressRepository.findByUserId(userId);

    if (!userAddress) {
      return left(new AddressNotFoundError());
    }

    const userAddressUpdated = userAddress.update({
      userId: userAddress.userId,
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

    await this.userAddressRepository.update(userAddressUpdated);

    return right({ userAddressUpdated });
  }
}
