import { UserAddress } from "src/domain/store/enterprise/entities/user-address";

export class UserAddressPresenter {
  static toHTTP(UserAddress: UserAddress) {
    return {
      id: UserAddress.id.toString(),
      cep: UserAddress.cep,
      city: UserAddress.city,
      uf: UserAddress.uf,
      street: UserAddress.street,
      neighborhood: UserAddress.neighborhood,
      houseNumber: UserAddress.houseNumber,
      complement: UserAddress.complement,
      phoneNumber: UserAddress.phoneNumber,
      username: UserAddress.username,
      email: UserAddress.email,
    };
  }
}
