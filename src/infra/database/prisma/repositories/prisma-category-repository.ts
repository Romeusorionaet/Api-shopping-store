import { PaginationParams } from "src/core/repositories/pagination-params";
import { CategoryRepository } from "src/domain/store/application/repositories/category-repository";
import { Category } from "src/domain/store/enterprise/entities/category";
import { prisma } from "src/infra/database/prisma/prisma";
import { PrismaCategoryMapper } from "../mappers/prisma-category-mapper";

export class PrismaCategoryRepository implements CategoryRepository {
  async create(data: Category): Promise<void> {
    const category = {
      id: data.id.toString(),
      title: data.title,
      slug: data.slug.value,
      imgUrl: data.imgUrl,
    };

    await prisma.category.create({
      data: category,
    });
  }

  async findMany({ page }: PaginationParams): Promise<Category[]> {
    const perPage = 10;

    const category = await prisma.category.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    return category.map(PrismaCategoryMapper.toDomain);
  }

  async findByTitle(title: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: {
        title,
      },
    });

    if (!category) {
      return null;
    }

    return PrismaCategoryMapper.toDomain(category);
  }
}
