import { PaginationParams } from "src/core/repositories/pagination-params";
import { CategoryRepository } from "../category-repository";
import { prisma } from "src/lib/prisma";
import { Category, Prisma } from "@prisma/client";

export class PrismaCategoryRepository implements CategoryRepository {
  async create(category: Prisma.CategoryCreateInput): Promise<void> {
    await prisma.category.create({
      data: category,
    });
  }

  async findMany({ page }: PaginationParams): Promise<Category[]> {
    const category = await prisma.category.findMany({});

    const listCategory = category
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return listCategory;
  }

  async getByTitle(title: string): Promise<Category[]> {
    const category = await prisma.category.findMany({
      where: {
        title,
      },
    });

    return category;
  }
}
