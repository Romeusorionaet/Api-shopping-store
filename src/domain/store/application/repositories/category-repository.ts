import { Category } from "../../enterprise/entities/category";

export interface CategoryRepository {
  create(category: Category): Promise<void>;
}
