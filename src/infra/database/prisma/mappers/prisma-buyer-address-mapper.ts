import { Prisma, BuyerAddress as PrismaBuyerAddress } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { BuyerAddress } from "src/domain/store/enterprise/entities/buyer-address";

export class PrismaBuyerAddressMapper {
  static toDomain(raw: PrismaBuyerAddress): BuyerAddress {
    return BuyerAddress.create(
      {
        username: raw.username,
        email: raw.email,
        buyerId: new UniqueEntityID(raw.buyerId),
        orderId: raw.orderId ? new UniqueEntityID(raw.orderId) : null,
        cep: raw.cep,
        city: raw.city,
        complement: raw.complement,
        houseNumber: raw.houseNumber,
        neighborhood: raw.neighborhood,
        phoneNumber: raw.phoneNumber,
        street: raw.street,
        uf: raw.uf,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    buyerAddress: BuyerAddress,
  ): Prisma.BuyerAddressUncheckedCreateInput {
    return {
      id: buyerAddress.id.toString(),
      username: buyerAddress.username,
      email: buyerAddress.email,
      buyerId: buyerAddress.buyerId.toString(),
      orderId: buyerAddress.orderId?.toString(),
      cep: buyerAddress.cep,
      city: buyerAddress.city,
      complement: buyerAddress.complement,
      houseNumber: buyerAddress.houseNumber,
      neighborhood: buyerAddress.neighborhood,
      phoneNumber: buyerAddress.phoneNumber,
      street: buyerAddress.street,
      uf: buyerAddress.uf,
      createdAt: buyerAddress.createdAt,
      updatedAt: buyerAddress.updatedAt,
    };
  }
}
