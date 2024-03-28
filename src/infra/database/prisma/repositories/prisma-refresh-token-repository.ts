import dayjs from "dayjs";
import { RefreshToken } from "src/domain/store/enterprise/entities/refresh-token";
import { prisma } from "../prisma";
import { PrismaRefreshTokenMapper } from "../mappers/prisma-refresh-token-mapper";
import { RefreshTokensRepository } from "src/domain/store/application/repositories/refresh-token-repository";

export class PrismaRefreshTokenRepository implements RefreshTokensRepository {
  async create(userId: string): Promise<RefreshToken> {
    const expires = dayjs().add(1, "m").unix();

    const refreshToken = await prisma.refreshToken.create({
      data: {
        userId,
        expires,
      },
    });

    return PrismaRefreshTokenMapper.toDomain(refreshToken);
  }

  async refreshToken(refreshId: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        id: refreshId,
      },
    });

    if (!refreshToken) {
      return null;
    }

    return PrismaRefreshTokenMapper.toDomain(refreshToken);
  }

  async deleteMany(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}
