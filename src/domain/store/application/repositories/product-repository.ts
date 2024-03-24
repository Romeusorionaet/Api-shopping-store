import { PaginationParams } from "src/core/repositories/pagination-params";
import { Product } from "../../enterprise/entities/product";

export interface ProductRepository {
  create(data: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findByTitle(title: string): Promise<Product | null>;
  findMany(page: PaginationParams): Promise<Product[]>;
  searchMany(query: string, page: number): Promise<Product[] | null>;
  update(data: Product): Promise<void>;
}
