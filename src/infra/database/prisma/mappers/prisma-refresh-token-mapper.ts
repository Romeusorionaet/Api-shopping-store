import { RefreshToken as PrismaRefreshToken } from "@prisma/client";
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
}
