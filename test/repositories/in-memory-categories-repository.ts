import { PaginationParams } from "src/core/repositories/pagination-params";
import {
  CategoriesBasicDataProps,
  CategoryRepository,
  CategorySummariesType,
} from "src/domain/store/application/repositories/category-repository";
import { Category } from "src/domain/store/enterprise/entities/category";
import { InMemoryProductDataStoreRepository } from "./in-memory-product-data-store-repository";

export class InMemoryCategoriesRepository implements CategoryRepository {
  public items: Category[] = [];

  constructor(private dataStore: InMemoryProductDataStoreRepository) {}

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

  async findMany({
    page,
  }: PaginationParams): Promise<Category[] | CategoriesBasicDataProps[]> {
    if (!page) {
      const categories = await this.findManyBasicData();

      return categories;
    }

    const perPage = 10;

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const categories = this.items.slice(startIndex, endIndex);

    return categories;
  }

  async findManyBasicData(): Promise<CategoriesBasicDataProps[]> {
    const categories = this.items.map((category) => ({
      id: category.id.toString(),
      title: category.title,
    }));

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

  async update(category: Category): Promise<void> {
    const existingCategory = this.items.find((item) => item.id === category.id);

    if (existingCategory) {
      Object.assign(existingCategory, category);
    } else {
      throw new Error("Categoria não encontrada");
    }
  }

  async remove(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.toString() !== id);
  }

  async findManyCategorySummaries(): Promise<CategorySummariesType[]> {
    return this.items.map((category) => {
      const productCount = this.dataStore.items.filter(
        (product) => product.categoryId === category.id,
      ).length;

      return {
        id: category.id.toString(),
        title: category.title,
        productCount,
      };
    });
  }
}
