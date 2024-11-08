import { PaginationParams } from "src/core/repositories/pagination-params";
import { Category } from "../../enterprise/entities/category";

export type CategoriesBasicDataProps = {
  id: string;
  title: string;
};

export interface CategoryRepository {
  create(data: Category): Promise<void>;
  findMany(
    page: PaginationParams,
  ): Promise<Category[] | CategoriesBasicDataProps[]>;
  findByTitle(title: string): Promise<Category | null>;
  findById(id: string): Promise<Category | null>;
  update(category: Category): Promise<void>;
  remove(id: string): Promise<void>;
}
