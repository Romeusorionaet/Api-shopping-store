import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import { User, UserProps } from "src/domain/store/enterprise/entities/user";
import { FakeHasher } from "../cryptography/fake-hasher";

export async function MakeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const fakerHasher = new FakeHasher();
  const hashedPassword = await fakerHasher.hash("123456");

  const user = User.create(
    {
      username: faker.lorem.sentence(10),
      email: faker.lorem.sentence(10),
      password: hashedPassword,
      ...override,
    },
    id,
  );

  return user;
}
