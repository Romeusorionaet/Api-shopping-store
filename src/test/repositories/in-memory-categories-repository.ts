import { Category, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { CategoryRepository } from "src/domain/store/application/repositories/category-repository";
import { Slug } from "src/domain/store/enterprise/entities/value-objects/slug";

export class InMemoryCategoriesRepository implements CategoryRepository {
  public items: Category[] = [];

  async create(data: Prisma.CategoryCreateInput): Promise<void> {
    const category = {
      id: data.id ?? randomUUID(),
      title: data.title,
      slug: data.slug ?? Slug.createFromText(data.title),
      imgUrl: data.imgUrl,
      productQuantity: data.productQuantity ?? 0,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    this.items.push(category);
  }

  async findMany({ page }: PaginationParams): Promise<Category[]> {
    const categories = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return categories;
  }

  async getByTitle(title: string): Promise<Category[]> {
    const category = this.items.filter((item) => item.title === title);

    return category;
  }
}
