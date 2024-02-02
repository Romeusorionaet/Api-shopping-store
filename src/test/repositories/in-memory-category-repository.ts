import { CategoryRepository } from "src/domain/store/application/repositories/category-repository";
import { Category } from "src/domain/store/enterprise/entities/category";

export class InMemoryCategoryRepository implements CategoryRepository {
  public items: Category[] = [];

  async create(category: Category): Promise<void> {
    this.items.push(category);
  }
}
