import { PaginationParams } from "src/core/repositories/pagination-params";
import { Product } from "../../enterprise/entities/product";
import { OrderProduct } from "../../enterprise/entities/order-product";

export interface ProductRepository {
  create(data: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findByTitle(title: string): Promise<Product | null>;
  findMany(page: PaginationParams): Promise<Product[]>;
  searchMany(query: string, page: number): Promise<Product[] | null>;
  update(data: Product): Promise<void>;
  decrementStockQuantity(orderProducts: OrderProduct[]): Promise<void>;
  findManyByCategoryId(id: string, page: number): Promise<Product[] | null>;
  addStarToProduct(id: string): Promise<void>;
}
