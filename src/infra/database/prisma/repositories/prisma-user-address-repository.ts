import { prisma } from "../prisma";
import { UserAddressRepository } from "src/domain/store/application/repositories/user-address-repository";
import { UserAddress } from "src/domain/store/enterprise/entities/user-address";
import { PrismaUserAddressMapper } from "../mappers/prisma-user-address-mapper";
import { CacheRepository } from "src/infra/cache/cache-repository";
import { CacheKeysPrefix } from "src/core/constants/cache-keys-prefix";

export class PrismaUserAddressRepository implements UserAddressRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async create(userAddress: UserAddress): Promise<void> {
    const data = PrismaUserAddressMapper.toPrisma(userAddress);

    await prisma.userAddress.create({
      data,
    });

    await this.cacheRepository.deleteCacheByPattern(
      `${CacheKeysPrefix.USER_ADDRESS}:*`,
    );
  }

  async findByUserId(userId: string): Promise<UserAddress | null> {
    const cacheKey = `${CacheKeysPrefix.USER_ADDRESS}:unique:${userId}`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return cacheData.map(PrismaUserAddressMapper.toDomain);
    }

    const userAddress = await prisma.userAddress.findFirst({
      where: {
        userId,
      },
    });

    if (!userAddress) {
      return null;
    }

    const userAddressMapped = PrismaUserAddressMapper.toDomain(userAddress);

    await this.cacheRepository.set(cacheKey, JSON.stringify(userAddress));

    return userAddressMapped;
  }

  async update(userAddress: UserAddress): Promise<void> {
    const data = PrismaUserAddressMapper.toPrisma(userAddress);

    await prisma.userAddress.update({
      where: {
        id: data.id,
      },
      data,
    });

    await this.cacheRepository.deleteCacheByPattern(
      `${CacheKeysPrefix.USER_ADDRESS}:*`,
    );
  }
}
