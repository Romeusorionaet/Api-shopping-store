import { BuyerAddress } from "src/domain/store/enterprise/entities/buyer-address";

export class BuyerAddressPresenter {
  static toHTTP(BuyerAddress: BuyerAddress) {
    return {
      id: BuyerAddress.id.toString(),
      cep: BuyerAddress.cep,
      city: BuyerAddress.city,
      uf: BuyerAddress.uf,
      street: BuyerAddress.street,
      neighborhood: BuyerAddress.neighborhood,
      houseNumber: BuyerAddress.houseNumber,
      complement: BuyerAddress.complement,
      phoneNumber: BuyerAddress.phoneNumber,
      username: BuyerAddress.username,
      email: BuyerAddress.email,
      createAt: BuyerAddress.createdAt,
      updateAt: BuyerAddress.updatedAt,
    };
  }
}
