import { PaginationParams } from "src/core/repositories/pagination-params";
import { Category, Prisma } from "@prisma/client";

export interface CategoryRepository {
  create(category: Prisma.CategoryCreateInput): Promise<void>;
  findMany(page: PaginationParams): Promise<Category[]>;
  getByTitle(title: string): Promise<Category[]>;
}
