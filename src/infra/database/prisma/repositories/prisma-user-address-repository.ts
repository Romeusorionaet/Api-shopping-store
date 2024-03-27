import { prisma } from "../prisma";
import { UserAddressRepository } from "src/domain/store/application/repositories/user-address-repository";
import { UserAddress } from "src/domain/store/enterprise/entities/user-address";
import { PrismaUserAddressMapper } from "../mappers/prisma-user-address-mapper";

export class PrismaUserAddressRepository implements UserAddressRepository {
  async create(userAddress: UserAddress): Promise<void> {
    const data = PrismaUserAddressMapper.toPrisma(userAddress);

    await prisma.userAddress.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<UserAddress | null> {
    const userAddress = await prisma.userAddress.findFirst({
      where: {
        userId,
      },
    });

    if (!userAddress) {
      return null;
    }

    return PrismaUserAddressMapper.toDomain(userAddress);
  }
}
