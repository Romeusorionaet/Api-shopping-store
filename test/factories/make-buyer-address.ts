import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import {
  BuyerAddress,
  BuyerAddressProps,
} from "src/domain/store/enterprise/entities/buyer-address";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { PrismaBuyerAddressMapper } from "src/infra/database/prisma/mappers/prisma-buyer-address-mapper";

export function makeBuyerAddress(
  override: Partial<BuyerAddressProps> = {},
  id?: UniqueEntityID,
) {
  const buyerAddress = BuyerAddress.create(
    {
      buyerId: new UniqueEntityID(),
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
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  );

  return buyerAddress;
}

export class BuyerAddressFactory {
  async makePrismaBuyerAddress(
    data: Partial<BuyerAddressProps> = {},
  ): Promise<BuyerAddress> {
    const buyerAddress = makeBuyerAddress(data);

    await prisma.buyerAddress.create({
      data: PrismaBuyerAddressMapper.toPrisma(buyerAddress),
    });

    return buyerAddress;
  }
}
