import { UsersRepository } from "../../repositories/users-repository";
import { Either, left, right } from "src/core/either";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { AddressAlreadyExistError } from "../errors/address-already-exist-error";
import { UserAddress } from "src/domain/store/enterprise/entities/user-address";
import { UserAddressRepository } from "../../repositories/user-address-repository";

interface CreateUserAddressUseCaseRequest {
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

type CreateUserAddressUseCaseResponse = Either<
  UserNotFoundError | AddressAlreadyExistError,
  {
    userAddress: UserAddress;
  }
>;

export class CreateUserAddressUseCase {
  constructor(
    private userAddressRepository: UserAddressRepository,
    private usersRepository: UsersRepository,
  ) {}

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
  }: CreateUserAddressUseCaseRequest): Promise<CreateUserAddressUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    const existBuyerAddress =
      await this.userAddressRepository.findByUserId(userId);

    if (existBuyerAddress) {
      return left(new AddressAlreadyExistError());
    }

    if (!user) {
      return left(new UserNotFoundError());
    }

    const userAddress = UserAddress.create({
      userId: user.id,
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

    await this.userAddressRepository.create(userAddress);

    return right({ userAddress });
  }
}
