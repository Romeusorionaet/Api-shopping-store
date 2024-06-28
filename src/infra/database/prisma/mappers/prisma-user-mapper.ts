import { Prisma, User as PrismaUser } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { User } from "src/domain/store/enterprise/entities/user";

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        publicId: new UniqueEntityID(raw.publicId),
        validationId: new UniqueEntityID(raw.validationId),
        username: raw.username,
        email: raw.email,
        password: raw.passwordHash,
        picture: raw.picture,
        emailVerified: raw.emailVerified,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      validationId: user.validationId?.toString() ?? "",
      publicId: user.publicId.toString(),
      username: user.username,
      email: user.email,
      passwordHash: user.password,
      picture: user.picture,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
