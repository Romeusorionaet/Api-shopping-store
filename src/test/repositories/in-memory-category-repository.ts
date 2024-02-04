import { PaginationParams } from "src/core/repositories/pagination-params";
import { CategoryRepository } from "src/domain/store/application/repositories/category-repository";
import { Category } from "src/domain/store/enterprise/entities/category";

export class InMemoryCategoryRepository implements CategoryRepository {
  public items: Category[] = [];

  async findMany({ page }: PaginationParams): Promise<Category[]> {
    const categories = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return categories;
  }

  async create(category: Category): Promise<void> {
    this.items.push(category);
  }
}
