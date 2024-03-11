import { PaginationParams } from "src/core/repositories/pagination-params";
import { CategoryRepository } from "src/domain/store/application/repositories/category-repository";
import { Category } from "src/domain/store/enterprise/entities/category";

export class InMemoryCategoriesRepository implements CategoryRepository {
  public items: Category[] = [];

  async create(data: Category): Promise<void> {
    this.items.push(data);
  }

  async findById(id: string): Promise<Category | null> {
    const category = this.items.find((item) => item.id.toString() === id);

    if (!category) {
      return null;
    }

    return category;
  }

  async findMany({ page }: PaginationParams): Promise<Category[]> {
    const perPage = 10;

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const categories = this.items.slice(startIndex, endIndex);

    return categories;
  }

  async findByTitle(title: string): Promise<Category | null> {
    const category = this.items.find((item) => item.title === title);

    if (!category) {
      return null;
    }

    return category;
  }

  async getByTitle(title: string): Promise<Category[]> {
    const category = this.items.filter((item) => item.title === title);

    return category;
  }
}
