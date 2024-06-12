import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import {
  UserAddress,
  UserAddressProps,
} from "src/domain/store/enterprise/entities/user-address";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { PrismaUserAddressMapper } from "src/infra/database/prisma/mappers/prisma-user-address-mapper";

export function makeUserAddress(
  override: Partial<UserAddressProps> = {},
  id?: UniqueEntityID,
) {
  const userAddress = UserAddress.create(
    {
      userId: new UniqueEntityID(),
      cep: 12345678,
      city: faker.lorem.sentence(2),
      uf: faker.lorem.word(2),
      street: faker.lorem.sentence(3),
      neighborhood: faker.lorem.sentence(3),
      houseNumber: 489,
      complement: faker.lorem.sentence(4),
      phoneNumber: "1234567891",
      username: faker.person.fullName(),
      email: "example@gmail.com",
      ...override,
    },
    id,
  );

  return userAddress;
}

export class UserAddressFactory {
  async makePrismaUserAddress(
    data: Partial<UserAddressProps> = {},
  ): Promise<UserAddress> {
    const userAddress = makeUserAddress(data);

    await prisma.userAddress.create({
      data: PrismaUserAddressMapper.toPrisma(userAddress),
    });

    return userAddress;
  }
}
