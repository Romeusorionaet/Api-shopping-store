import { Category as PrismaCategory } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Category } from "src/domain/store/enterprise/entities/category";
import { Slug } from "src/domain/store/enterprise/entities/value-objects/slug";

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create(
      {
        title: raw.title,
        slug: Slug.create(raw.slug),
        imgUrl: raw.imgUrl,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }
}
