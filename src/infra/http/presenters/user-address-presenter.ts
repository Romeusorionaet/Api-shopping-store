import { UserAddress } from "src/domain/store/enterprise/entities/user-address";

export class UserAddressPresenter {
  static toHTTP(userAddress: UserAddress) {
    return {
      id: userAddress.id.toString(),
      cep: userAddress.cep,
      city: userAddress.city,
      uf: userAddress.uf,
      street: userAddress.street,
      neighborhood: userAddress.neighborhood,
      houseNumber: userAddress.houseNumber,
      complement: userAddress.complement,
      phoneNumber: userAddress.phoneNumber,
      username: userAddress.username,
      email: userAddress.email,
    };
  }
}
