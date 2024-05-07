import { UsersRepository } from "src/domain/store/application/repositories/users-repository";
import { User } from "src/domain/store/enterprise/entities/user";
import { prisma } from "../prisma";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { CacheRepository } from "src/infra/cache/cache-repository";

export class PrismaUserRepository implements UsersRepository {
  constructor(private cacheRepository: CacheRepository) {}

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
    const cacheHit = await this.cacheRepository.get(`user:${id}:profile`);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return PrismaUserMapper.toDomain(cacheData);
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    const userProfile = PrismaUserMapper.toDomain(user);

    await this.cacheRepository.set(`user:${id}:profile`, JSON.stringify(user));

    return userProfile;
  }
}
