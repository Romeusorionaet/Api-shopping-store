import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import { User, UserProps } from "src/domain/store/enterprise/entities/user";
import { FakeHasher } from "../cryptography/fake-hasher";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { PrismaUserMapper } from "src/infra/database/prisma/mappers/prisma-user-mapper";

export async function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const fakerHasher = new FakeHasher();
  const hashedPassword = await fakerHasher.hash("123456");

  const user = User.create(
    {
      validationId: new UniqueEntityID(),
      publicId: new UniqueEntityID(),
      username: faker.person.fullName(),
      email: faker.lorem.sentence(10),
      password: hashedPassword,
      picture: `http://${faker.person.firstName}/faker_picture.com`,
      emailVerified: true,
      ...override,
    },
    id,
  );

  return user;
}

export class UserFactory {
  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = await makeUser(data);

    await prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
