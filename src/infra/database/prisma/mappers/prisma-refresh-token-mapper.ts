import { Prisma, RefreshToken as PrismaRefreshToken } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { RefreshToken } from "src/domain/store/enterprise/entities/refresh-token";

export class PrismaRefreshTokenMapper {
  static toDomain(raw: PrismaRefreshToken): RefreshToken {
    return RefreshToken.create(
      {
        userId: new UniqueEntityID(raw.userId),
        expires: raw.expires,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    refreshToken: RefreshToken,
  ): Prisma.RefreshTokenUncheckedCreateInput {
    return {
      id: refreshToken.id.toString(),
      userId: refreshToken.userId.toString(),
      expires: refreshToken.expires,
    };
  }
}
