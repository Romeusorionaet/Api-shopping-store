/* eslint-disable camelcase */
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import { User, UserProps } from "src/domain/store/enterprise/entities/user";
import { hash } from "bcryptjs";

export async function MakeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const password_hash = await hash("123456", 6);

  const user = User.create(
    {
      username: faker.lorem.sentence(10),
      email: faker.lorem.sentence(10),
      password: password_hash,
      ...override,
    },
    id,
  );

  return user;
}
