import { UsersRepository } from "src/domain/store/application/repositories/users-repository";
import { User } from "src/domain/store/enterprise/entities/user";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";

export class PrismaUserRepository implements UsersRepository {
  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    const userProfile = PrismaUserMapper.toDomain(user);

    return userProfile;
  }

  async confirmEmail(token: string): Promise<object | null> {
    const result = await prisma.user.update({
      where: {
        validationId: token,
      },
      data: {
        emailVerified: true,
        validationId: "",
      },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async update(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
