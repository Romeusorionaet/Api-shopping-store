import { RefreshToken } from "src/domain/store/enterprise/entities/refresh-token";
import { prisma } from "../prisma";
import { PrismaRefreshTokenMapper } from "../mappers/prisma-refresh-token-mapper";
import { RefreshTokensRepository } from "src/domain/store/application/repositories/refresh-token-repository";
import { CacheRepository } from "src/infra/cache/cache-repository";

export class PrismaRefreshTokenRepository implements RefreshTokensRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async create(refreshToken: RefreshToken): Promise<RefreshToken> {
    const data = PrismaRefreshTokenMapper.toPrisma(refreshToken);
    console.log("=entrou no refreshToken", data);

    await prisma.refreshToken.create({
      data,
    });

    console.log("=saiu do refreshToken", refreshToken);

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
    await this.cacheRepository.delete(`user:${userId}:profile`);

    await prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}
