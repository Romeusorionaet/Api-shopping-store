import { ProductProps } from "../../enterprise/entities/product";

export interface ProductRepository {
  create(data: ProductProps): Promise<void>;
  findById(id: string): Promise<ProductProps | null>;
  searchMany(query: string, page: number): Promise<ProductProps[]>;
}
