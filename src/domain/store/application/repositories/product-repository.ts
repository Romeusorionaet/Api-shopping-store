import { Product } from "../../enterprise/entities/product";

export interface ProductRepository {
  create(data: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  searchMany(query: string, page: number): Promise<Product[]>;
}
