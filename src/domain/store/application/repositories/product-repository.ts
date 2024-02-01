import { Product } from "../../enterprise/entities/product";

export interface ProductRepository {
  create(product: Product): Promise<void>;
}
