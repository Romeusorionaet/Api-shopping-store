import { Prisma, UserAddress as PrismaUserAddress } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { UserAddress } from "src/domain/store/enterprise/entities/user-address";

export class PrismaUserAddressMapper {
  static toDomain(raw: PrismaUserAddress): UserAddress {
    return UserAddress.create(
      {
        userId: new UniqueEntityID(raw.userId),
        username: raw.username,
        email: raw.email,
        cep: raw.cep,
        city: raw.city,
        complement: raw.complement,
        houseNumber: raw.houseNumber,
        neighborhood: raw.neighborhood,
        phoneNumber: raw.phoneNumber,
        street: raw.street,
        uf: raw.uf,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    userAddress: UserAddress,
  ): Prisma.UserAddressUncheckedCreateInput {
    return {
      id: userAddress.id.toString(),
      userId: userAddress.userId.toString(),
      username: userAddress.username,
      email: userAddress.email,
      cep: userAddress.cep,
      city: userAddress.city,
      complement: userAddress.complement,
      houseNumber: userAddress.houseNumber,
      neighborhood: userAddress.neighborhood,
      phoneNumber: userAddress.phoneNumber,
      street: userAddress.street,
      uf: userAddress.uf,
    };
  }
}
