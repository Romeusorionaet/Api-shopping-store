import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import {
  BuyerAddress,
  BuyerAddressProps,
} from "src/domain/store/enterprise/entities/buyer-address";

export async function makeBuyerAddress(
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
      phoneNumber: 1234567891,
      username: faker.person.fullName(),
      email: "example@gmail.com",
      ...override,
    },
    id,
  );

  return buyerAddress;
}
