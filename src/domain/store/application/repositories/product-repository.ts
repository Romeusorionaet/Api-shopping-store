import { Product } from "../../enterprise/entities/product";

export interface ProductRepository {
  create(product: Product): Promise<void>;
  searchMany(query: string, page: number): Promise<Product[]>;
}
