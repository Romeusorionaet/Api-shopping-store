import { PaginationParams } from "src/core/repositories/pagination-params";
import { Category } from "../../enterprise/entities/category";

export interface CategoryRepository {
  create(data: Category): Promise<void>;
  findMany(page: PaginationParams): Promise<Category[]>;
  findByTitle(title: string): Promise<Category | null>;
}
