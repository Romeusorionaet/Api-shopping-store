import { PaginationParams } from "src/core/repositories/pagination-params";
import { Product } from "../../enterprise/entities/product";
import { OrderProduct } from "../../enterprise/entities/order-product";
import { TechnicalProductDetails } from "../../enterprise/entities/technical-product-details";

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
  createTechnicalProductDetails(data: TechnicalProductDetails): Promise<void>;
  updateTechnicalProductDetails(data: TechnicalProductDetails): Promise<void>;
  findTechnicalProductDetails(
    id: string,
  ): Promise<TechnicalProductDetails | null>;
  findTechnicalProductDetailsByProductId(
    id: string,
  ): Promise<TechnicalProductDetails | null>;
  findManyByStars(page: number): Promise<Product[] | null>;
  findManyByDiscountPercentage(page: number): Promise<Product[] | null>;
}
