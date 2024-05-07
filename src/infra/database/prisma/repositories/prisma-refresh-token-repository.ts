import { RefreshToken } from "src/domain/store/enterprise/entities/refresh-token";
import { prisma } from "../prisma";
import { PrismaRefreshTokenMapper } from "../mappers/prisma-refresh-token-mapper";
import { RefreshTokensRepository } from "src/domain/store/application/repositories/refresh-token-repository";

export class PrismaRefreshTokenRepository implements RefreshTokensRepository {
  async create(refreshToken: RefreshToken): Promise<RefreshToken> {
    const data = PrismaRefreshTokenMapper.toPrisma(refreshToken);

    await prisma.refreshToken.create({
      data,
    });

    return refreshToken;
  }

  async refreshToken(refreshTokenId: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        id: refreshTokenId,
      },
    });

    if (!refreshToken) {
      return null;
    }

    return PrismaRefreshTokenMapper.toDomain(refreshToken);
  }

  async deleteMany(userId: string): Promise<void> {
    // delete cache for logout user in frontend
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}
